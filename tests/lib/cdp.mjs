/**
 * Minimal Chrome DevTools Protocol driver, so browser tests need no npm packages.
 * Uses the installed Chrome (CHROME_PATH to override). Node 22+ for global WebSocket.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export const chromePath = CANDIDATES.find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch(port = 9400 + Math.floor(Math.random() * 400)) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'um-cdp-'));
  const proc = spawn(chromePath, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await sleep(200);
    }
  }
  return {
    /** A fresh tab. Options: width, height, mobile, theme, reducedMotion, js, init (script run before page JS). */
    async page(o = {}) {
      const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
      const ws = new WebSocket(t.webSocketDebuggerUrl);
      await new Promise((r) => (ws.onopen = r));
      let id = 0;
      const pend = new Map();
      const errors = [];
      const consoleErrors = [];
      ws.onmessage = (m) => {
        const d = JSON.parse(m.data);
        if (d.id && pend.has(d.id)) {
          pend.get(d.id)(d);
          pend.delete(d.id);
        } else if (d.method === 'Runtime.exceptionThrown') {
          errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
        } else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') {
          consoleErrors.push(d.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
        }
      };
      const send = (method, params = {}) =>
        new Promise((r) => {
          const i = ++id;
          pend.set(i, r);
          ws.send(JSON.stringify({ id: i, method, params }));
        });
      await send('Page.enable');
      await send('Runtime.enable');
      const w = o.width ?? 1280;
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: o.height ?? 800, deviceScaleFactor: 1, mobile: o.mobile ?? w < 600 });
      const features = [{ name: 'prefers-color-scheme', value: o.theme ?? 'light' }];
      if (o.reducedMotion) features.push({ name: 'prefers-reduced-motion', value: 'reduce' });
      await send('Emulation.setEmulatedMedia', { features });
      if (o.js === false) await send('Emulation.setScriptExecutionDisabled', { value: true });
      if (o.init) await send('Page.addScriptToEvaluateOnNewDocument', { source: o.init });

      const api = {
        errors,
        consoleErrors,
        send,
        async eval(expr) {
          const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
          if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval failed');
          return r.result?.result?.value;
        },
        async goto(url, settle = 1500) {
          await send('Page.navigate', { url });
          for (let i = 0; i < 60; i++) {
            await sleep(150);
            try {
              if ((await api.eval('document.readyState')) === 'complete') break;
            } catch {}
          }
          await sleep(settle);
        },
        async key(key, code = key, keyCode = 0) {
          for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: keyCode });
        },
        async shot(file) {
          const r = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'));
        },
        close: async () => {
          ws.close();
          await fetch(`http://127.0.0.1:${port}/json/close/${t.id}`).catch(() => {});
        },
      };
      return api;
    },
    close() {
      proc.kill();
    },
  };
}

export { sleep };
