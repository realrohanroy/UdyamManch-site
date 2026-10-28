'use client';

import { useEffect, useRef } from 'react';

/*
 * Interactive version of the pinboard dot grid. Dots near the cursor are
 * pulled towards it, grow a little and take the accent colour, then spring
 * back when the cursor leaves.
 *
 * Usage: put <MagneticDots /> as the first child of any element that draws
 * the CSS dot grid (background-image radial-gradient of var(--dot)). Pass
 * the same gap and dot size as that CSS so the two line up. The element
 * must be positioned and form a stacking context (isolation: isolate, a
 * mask, or a z-index), because the canvas sits behind its content.
 *
 * The CSS grid stays as the fallback. This canvas only takes over (by
 * clearing the element's background-image) on devices with a fine pointer
 * and no reduced motion preference. Touch and reduced motion visitors keep
 * the static grid, which looks identical at rest.
 *
 * Colours come from the --dot and --dot-active tokens, re-read when the
 * theme changes, so there is no colour value in this file.
 *
 * How it stays cheap:
 * - The whole grid is painted once. Each frame only clears and repaints the
 *   small rectangle around the dots that moved, so the cost depends on the
 *   size of the field, not the size of the page.
 * - Only dots near the cursor, or still settling, are simulated.
 * - The loop stops as soon as nothing is moving, including while the cursor
 *   rests in one place.
 * - The cursor is kept in viewport coordinates and mapped onto the grid each
 *   frame, so scrolling under a still cursor moves the field with it.
 */

const REACH = 200; // px from the cursor that dots feel the pull
const PULL = 0.3; // share of the distance a dot moves towards the cursor
const MAX_SHIFT = 13; // px, so the grid never visibly tears
const GROW = 1; // extra radius at the centre of the field
const SPRING = 0.11; // pull towards the target, per 60fps frame
const FRICTION = 0.76; // velocity kept per 60fps frame
const FOLLOW = 0.3; // how quickly the field catches up with the cursor
const FADE = 0.12; // how quickly the field appears and disappears
const MAX_PIXELS = 8_000_000; // canvas backing store budget, about 32 MB

type Props = {
  /** Grid spacing in px, the CSS background-size. */
  gap?: number;
  /** Dot radius in px, the first radial-gradient stop. */
  size?: number;
};

export default function MagneticDots({ gap = 22, size = 1.2 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pad = size + GROW + 1; // paint margin around a dot
    const reachCells = Math.ceil(REACH / gap);
    const spanCells = Math.ceil((MAX_SHIFT + pad) / gap);

    // Grid state in flat typed arrays: index = row * cols + col.
    let cols = 0;
    let rows = 0;
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let tint = new Float32Array(0);
    let live = new Uint8Array(0);
    const active = new Set<number>();

    let width = 0;
    let height = 0;
    let base = '';
    let accent = '';

    // Cursor in viewport coordinates. It is mapped onto the grid every frame
    // through a fresh host rect, so the field stays under a still cursor while
    // the page scrolls.
    let clientX = 0;
    let clientY = 0;
    let hasPointer = false;
    let rect = host.getBoundingClientRect();
    let lastTop = rect.top;
    let lastLeft = rect.left;

    // Smoothed field centre in viewport coordinates, and strength (0 to 1).
    // Smoothing happens on screen, not on the page: the field glides after
    // the cursor, but scrolling carries it along exactly, with no lag.
    let sx = 0;
    let sy = 0;
    let strength = 0;

    let frame = 0;
    let last = 0;

    const homeX = (i: number) => gap / 2 + (i % cols) * gap;
    const homeY = (i: number) => gap / 2 + Math.floor(i / cols) * gap;

    const readColours = () => {
      const styles = getComputedStyle(host);
      base = styles.getPropertyValue('--dot').trim();
      accent = styles.getPropertyValue('--dot-active').trim() || base;
    };

    const layout = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(MAX_PIXELS / Math.max(1, width * height)),
      );
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil((width - gap / 2) / gap);
      rows = Math.ceil((height - gap / 2) / gap);
      const n = Math.max(0, cols * rows);
      x = new Float32Array(n);
      y = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      tint = new Float32Array(n);
      live = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        x[i] = homeX(i);
        y[i] = homeY(i);
      }
      active.clear();
    };

    // Repaints every dot whose home cell is near the rectangle, clipped to it.
    // Resting dots share one path and one fill; tinted dots are drawn after.
    const paint = (left: number, top: number, right: number, bottom: number) => {
      left = Math.max(0, Math.floor(left));
      top = Math.max(0, Math.floor(top));
      right = Math.min(width, Math.ceil(right));
      bottom = Math.min(height, Math.ceil(bottom));
      if (right <= left || bottom <= top) return;

      const c0 = Math.max(0, Math.floor((left - gap / 2) / gap) - spanCells);
      const c1 = Math.min(cols - 1, Math.ceil((right - gap / 2) / gap) + spanCells);
      const r0 = Math.max(0, Math.floor((top - gap / 2) / gap) - spanCells);
      const r1 = Math.min(rows - 1, Math.ceil((bottom - gap / 2) / gap) + spanCells);

      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, right - left, bottom - top);
      ctx.clip();
      ctx.clearRect(left, top, right - left, bottom - top);

      ctx.fillStyle = base;
      ctx.beginPath();
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const i = r * cols + c;
          if (tint[i] > 0.02) continue;
          ctx.moveTo(x[i] + size, y[i]);
          ctx.arc(x[i], y[i], size, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      ctx.fillStyle = accent;
      active.forEach((i) => {
        const t = tint[i];
        if (t <= 0.02 || x[i] < left - pad || x[i] > right + pad || y[i] < top - pad || y[i] > bottom + pad) return;
        ctx.globalAlpha = Math.min(1, 0.35 + t);
        ctx.beginPath();
        ctx.arc(x[i], y[i], size + GROW * t, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const paintAll = () => paint(0, 0, width, height);

    const tick = (now: number) => {
      // Frame rate independent: k is 1 at 60fps, 0.5 at 120fps.
      const k = last ? Math.min((now - last) / (1000 / 60), 3) : 1;
      last = now;

      // Measure the host every running frame. This is a read with no pending
      // layout writes, so it is cheap, and it never depends on a scroll event
      // having been delivered. A change means the page moved under the cursor.
      rect = host.getBoundingClientRect();
      const scrolled = rect.top !== lastTop || rect.left !== lastLeft;
      lastTop = rect.top;
      lastLeft = rect.left;
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const inside = hasPointer && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

      // Ease the field towards the cursor, and fade it in or out. When the
      // cursor leaves, the field fades where it is instead of snapping away.
      if (inside) {
        if (strength < 0.01) {
          sx = clientX;
          sy = clientY;
        }
        const follow = 1 - (1 - FOLLOW) ** k;
        sx += (clientX - sx) * follow;
        sy += (clientY - sy) * follow;
      }
      strength += ((inside ? 1 : 0) - strength) * (1 - (1 - FADE) ** k);
      if (!inside && strength < 0.002) strength = 0;

      // Field centre on the grid, using this frame's scroll position.
      const fx = sx - rect.left;
      const fy = sy - rect.top;

      // Recruit dots inside the field.
      if (strength > 0) {
        const cc = Math.round((fx - gap / 2) / gap);
        const rc = Math.round((fy - gap / 2) / gap);
        for (let r = Math.max(0, rc - reachCells); r <= Math.min(rows - 1, rc + reachCells); r++) {
          for (let c = Math.max(0, cc - reachCells); c <= Math.min(cols - 1, cc + reachCells); c++) {
            const i = r * cols + c;
            if (!live[i]) {
              live[i] = 1;
              active.add(i);
            }
          }
        }
      }

      const spring = SPRING * k;
      const friction = FRICTION ** k;
      const tintRate = 1 - 0.8 ** k;
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      let bottom = -Infinity;
      let moving = false;

      active.forEach((i) => {
        const hx = homeX(i);
        const hy = homeY(i);
        let tx = hx;
        let ty = hy;
        let tt = 0;
        if (strength > 0) {
          const dx = fx - hx;
          const dy = fy - hy;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH) {
            // Eased falloff: strong near the cursor, nothing at REACH.
            const f = (1 - dist / REACH) ** 2 * strength;
            const shift = Math.min(dist * PULL * f, MAX_SHIFT);
            if (dist > 0) {
              tx += (dx / dist) * shift;
              ty += (dy / dist) * shift;
            }
            tt = f;
          }
        }

        // Include where the dot was drawn last frame, so it gets erased.
        if (x[i] < left) left = x[i];
        if (x[i] > right) right = x[i];
        if (y[i] < top) top = y[i];
        if (y[i] > bottom) bottom = y[i];

        if (scrolled) {
          // The page moved under a cursor that may be still. Springs would
          // trail behind on fast scrolls, so dots jump straight to their
          // target and the field stays locked to the cursor.
          x[i] = tx;
          y[i] = ty;
          vx[i] = vy[i] = 0;
          tint[i] = tt;
        } else {
          vx[i] = (vx[i] + (tx - x[i]) * spring) * friction;
          vy[i] = (vy[i] + (ty - y[i]) * spring) * friction;
          x[i] += vx[i];
          y[i] += vy[i];
          tint[i] += (tt - tint[i]) * tintRate;
        }

        if (x[i] < left) left = x[i];
        if (x[i] > right) right = x[i];
        if (y[i] < top) top = y[i];
        if (y[i] > bottom) bottom = y[i];

        const settled =
          Math.abs(vx[i]) < 0.01 &&
          Math.abs(vy[i]) < 0.01 &&
          Math.abs(tx - x[i]) < 0.05 &&
          Math.abs(ty - y[i]) < 0.05 &&
          Math.abs(tt - tint[i]) < 0.005;

        if (!settled) {
          moving = true;
        } else if (tt === 0 && tx === hx && ty === hy) {
          // Back home and outside the field: stop simulating it.
          x[i] = hx;
          y[i] = hy;
          vx[i] = vy[i] = tint[i] = 0;
          live[i] = 0;
          active.delete(i);
        }
      });

      if (left <= right) paint(left - pad, top - pad, right + pad, bottom + pad);

      const fieldMoving = inside ? Math.abs(clientX - sx) > 0.1 || Math.abs(clientY - sy) > 0.1 || strength < 0.998 : strength > 0;
      if (moving || fieldMoving) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        last = 0;
      }
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const track = (cx: number, cy: number) => {
      clientX = cx;
      clientY = cy;
      hasPointer = true;
      wake();
    };

    // pointermove alone is not enough: after a page load (or a hot reload in
    // dev) the cursor can rest on the page without ever moving. Wheel events
    // and the over/out events the browser fires as content scrolls under a
    // still cursor both carry its position, so scrolling alone finds it.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') track(e.clientX, e.clientY);
    };

    const onWheel = (e: WheelEvent) => track(e.clientX, e.clientY);

    const onLeave = () => {
      hasPointer = false;
      wake();
    };

    const onScroll = () => {
      if (hasPointer || active.size) wake();
    };

    const onTheme = () => {
      readColours();
      paintAll();
    };

    readColours();
    layout();
    paintAll();

    // Hand over from the CSS grid to the canvas. Restored on unmount.
    const cssDots = host.style.backgroundImage;
    host.style.backgroundImage = 'none';

    const resize = new ResizeObserver(() => {
      layout();
      paintAll();
      if (hasPointer) wake();
    });
    resize.observe(host);

    const themeAttr = new MutationObserver(onTheme);
    themeAttr.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.addEventListener('change', onTheme);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onMove, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      themeAttr.disconnect();
      systemTheme.removeEventListener('change', onTheme);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onMove);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      host.style.backgroundImage = cssDots;
    };
  }, [gap, size]);

  return <canvas ref={canvasRef} className="mdots" aria-hidden="true" />;
}
