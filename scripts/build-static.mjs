/**
 * Static build for plain PHP/HTML hosting (Hostinger public_html), where Node.js cannot run.
 *
 *   npm run build:static        ->  ../udyammanch-static-YYYY-MM-DD.zip  (upload into public_html)
 *
 * WHY A SCRIPT AND NOT A CONFIG SWITCH
 * The normal build (Vercel or a Node.js app) uses server features a folder of files cannot
 * have: the Sanity webhook (/api/revalidate), the lowercase-address middleware, the Studio at
 * /admin and pages rendered on first request. Rather than litter the app with "if static"
 * checks, this script copies the project to a temporary folder, removes or adjusts only those
 * parts there, builds with output: 'export', adds an .htaccess for the server's job (clean
 * addresses, redirects, headers) and zips the result. The real source is never touched.
 *
 * WHAT THE STATIC SITE DOES NOT HAVE (see docs/DEPLOY_HOSTINGER.md)
 *   - Content updates need a rebuild and re-upload (no ISR, no webhook).
 *   - No /admin Studio. Fine while Sanity is not connected.
 *   - Capitalised addresses are not lowercased (that was the middleware).
 */
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STAGE = fs.mkdtempSync(path.join(os.tmpdir(), 'udyam-static-'));
const OUT_DIR = path.join(STAGE, 'out');
const day = new Date().toISOString().slice(0, 10);
// TEMPORARY (FLAGS.foundersOnly in src/lib/flags.ts): only founder story pages are reachable.
// The zip says so in its name, so it is never mistaken for the full site.
const foundersOnly = /foundersOnly:\s*true/.test(fs.readFileSync(path.join(ROOT, 'src/lib/flags.ts'), 'utf8'));
const ZIP = path.resolve(ROOT, '..', `udyammanch-static${foundersOnly ? '-founders-only' : ''}-${day}.zip`);

// The public host, from NEXT_PUBLIC_SITE_URL (the same default as src/lib/site.ts), and the
// other domains that should redirect to it once their DNS points at this hosting.
const PRIMARY = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://udyammanch.com').host;
const ALIASES = (process.env.ALIAS_DOMAINS ?? 'udyammanch.in').split(',').map((d) => d.trim()).filter(Boolean);
const hostRules = [`www.${PRIMARY}`, ...ALIASES.flatMap((d) => [d, `www.${d}`])]
  .map((h) => `RewriteCond %{HTTP_HOST} ^${h.replace(/\./g, '\\.')}$ [NC]\nRewriteRule ^(.*)$ https://${PRIMARY}/$1 [R=301,L]`)
  .join('\n');

const log = (m) => console.log(`[static] ${m}`);
const run = (cmd, cwd = STAGE) => execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });

/**
 * Downloads generated images from a normal production build of this project.
 * Set OG_SOURCE=http://localhost:3000 to use one that is already running (after npm run build
 * and npm start); otherwise one is built and started on a spare port, then stopped.
 */
async function fetchImages(paths) {
  let base = process.env.OG_SOURCE;
  let server;
  if (!base) {
    log('building the normal site once, to render the share images');
    run('npx next build', ROOT);
    base = 'http://localhost:3123';
    server = spawn('npx', ['next', 'start', '-p', '3123'], { cwd: ROOT, shell: true, stdio: 'ignore' });
    for (let i = 0; i < 120; i++) {
      try { if ((await fetch(base)).ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  try {
    const out = {};
    for (const p of paths) {
      const r = await fetch(base + p);
      if (!r.ok || !r.headers.get('content-type')?.startsWith('image/png')) throw new Error(`build-static: ${base}${p} returned ${r.status} ${r.headers.get('content-type')}`);
      out[p] = Buffer.from(await r.arrayBuffer());
    }
    return out;
  } finally {
    if (server) {
      if (process.platform === 'win32') execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
      else server.kill();
    }
  }
}

// 1. Copy the project into the staging folder. node_modules is linked, not copied.
const COPY = ['src', 'public', 'package.json', 'package-lock.json', 'tsconfig.json', 'next-env.d.ts', 'sanity.config.ts'];
for (const f of COPY) fs.cpSync(path.join(ROOT, f), path.join(STAGE, f), { recursive: true });
fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(STAGE, 'node_modules'), 'junction');
log(`staging in ${STAGE}`);

// 2. Remove the parts that need a server.
const drop = ['src/middleware.ts', 'src/app/api', 'src/app/admin', 'src/app/preview'];
for (const f of drop) fs.rmSync(path.join(STAGE, f), { recursive: true, force: true });

// 3. Adjust what is left. Each edit must match, or the build stops: better than shipping a surprise.
const edit = (file, from, to) => {
  const p = path.join(STAGE, file);
  const s = fs.readFileSync(p, 'utf8');
  if (!s.includes(from)) throw new Error(`build-static: expected text not found in ${file}: ${from}`);
  fs.writeFileSync(p, s.replace(from, to));
};
// Only the journeys that exist at build time can be pages; anything else is the 404 page.
edit('src/app/founders/[slug]/page.tsx', 'export const dynamicParams = true;', 'export const dynamicParams = false;');
// next-sanity's main entry also loads its visual editing Server Actions, which a static export
// refuses. createClient is the same function from the library next-sanity wraps.
edit('src/sanity/client.ts', "import { createClient } from 'next-sanity';", "import { createClient } from '@sanity/client';");
// Generated images. A static export cannot run the image routes (edge runtime), and Next's
// Node image generator is broken on Windows (it path.joins a file:// URL). So the images are
// saved from a normal production build and dropped in as plain files, which Next also accepts:
// app/opengraph-image.png and app/apple-icon.png get the same <meta> and <link> tags.
// The per-slug image routes go: every founder sets seo.image, and the sample story falls
// back to the site card. A founder without seo.image would point at a missing image, so
// the check in step 6 stops the build.
const images = await fetchImages(['/opengraph-image', '/apple-icon']);
for (const f of ['src/app/opengraph-image.tsx', 'src/app/apple-icon.tsx', 'src/app/founders/[slug]/opengraph-image.tsx', 'src/app/stories/[slug]/opengraph-image.tsx']) {
  fs.rmSync(path.join(STAGE, f));
}
fs.writeFileSync(path.join(STAGE, 'src/app/opengraph-image.png'), images['/opengraph-image']);
fs.writeFileSync(path.join(STAGE, 'src/app/opengraph-image.alt.txt'), 'Udyam Manch, stories behind India’s next big businesses');
fs.writeFileSync(path.join(STAGE, 'src/app/apple-icon.png'), images['/apple-icon']);

// 4. The export config. Redirects, rewrites and headers move to .htaccess (step 6).
const { default: base } = await import(path.join(ROOT, 'next.config.mjs').replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:'));
const redirects = await base.redirects();
fs.writeFileSync(
  path.join(STAGE, 'next.config.mjs'),
  `export default ${JSON.stringify({ reactStrictMode: true, poweredByHeader: false, output: 'export', images: { unoptimized: true } }, null, 2)};\n`,
);

// 5. Build.
run('npx next build');

// 6. Make the file layout and .htaccess work on Apache / LiteSpeed.
// Next writes founders.html next to a founders/ folder. Apache sees the folder first, so move
// each such page into its folder as index.html.
const moveIntoFolder = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) moveIntoFolder(p);
    else if (e.name.endsWith('.html') && fs.existsSync(p.slice(0, -5)) && fs.statSync(p.slice(0, -5)).isDirectory()) {
      fs.renameSync(p, path.join(p.slice(0, -5), 'index.html'));
    }
  }
};
moveIntoFolder(OUT_DIR);

// Every founder page must name its own share image (seo.image): the per-founder image route
// does not exist in the static site.
for (const f of fs.readdirSync(path.join(OUT_DIR, 'founders')).filter((n) => n.endsWith('.html') && n !== 'index.html')) {
  if (fs.readFileSync(path.join(OUT_DIR, 'founders', f), 'utf8').includes(`/founders/${f.slice(0, -5)}/opengraph-image`)) {
    throw new Error(`build-static: founders/${f} has no seo.image. Add a 1200 x 630 share image to its content file.`);
  }
}

const esc = (s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
const toRegex = (src) =>
  '^' +
  esc(src.replace(/^\//, ''))
    .replace(/\\\.:ext\\\(png\\\|webp\\\)/, '\\.(png|webp)')
    .replace(/:path\*/, '(.+)') // esc() leaves * alone, so match it unescaped
    .replace(/:slug/, '([^/]+)') +
  '$';
const toTarget = (dst) => dst.replace(':path*', '$1').replace(':slug', '$1');
// .htaccess rules run again after an internal rewrite. The clean-address rule below serves
// /founders from founders/index.html, so an index.html redirect must only fire when the visitor
// actually typed index.html (THE_REQUEST is the original request line), or it loops forever.
const redirectRules = redirects
  .map((r) => {
    const rule = `RewriteRule ${toRegex(r.source)} ${toTarget(r.destination)} [R=301,L]`;
    return r.source.endsWith('/index.html') ? `RewriteCond %{THE_REQUEST} \\s/\\S*index\\.html[\\s?]\n${rule}` : rule;
  })
  .join('\n');

// Founders only: everything else gets a real 404, except the files those pages load. 404.html
// must stay open, because the 404 itself is served by an internal request for it.
const openSlugs = fs.readdirSync(path.join(OUT_DIR, 'founders')).filter((n) => n.endsWith('.html') && n !== 'index.html').map((n) => esc(n.slice(0, -5)));
const closedRules = foundersOnly
  ? `
# TEMPORARY: only the founder story pages are open (FLAGS.foundersOnly). Everything else is a 404.
RewriteCond %{REQUEST_URI} !^/(_next|assets)/
RewriteCond %{REQUEST_URI} !^/(404\\.html|icon\\.svg|favicon\\.ico|apple-icon(\\.png)?|opengraph-image(\\.png)?|robots\\.txt)$
RewriteCond %{REQUEST_URI} !^/founders/(${openSlugs.join('|')})(\\.html|\\.txt|/index\\.html)?/?$
RewriteRule ^ - [R=404,L]
`
  : '';
if (foundersOnly) log(`founders only: ${openSlugs.length} founder pages open, everything else is a 404`);

const htaccess = `# Generated by scripts/build-static.mjs. Do not edit on the server: rebuild instead.
Options -Indexes -MultiViews
DirectorySlash Off
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On

# One public address. Other domains pointed at this folder (www, udyammanch.in) go to the same
# path on ${PRIMARY}, so shared links on any of them keep working.
${hostRules}

# Always HTTPS
RewriteCond %{HTTPS} !=on
RewriteCond %{HTTP:X-Forwarded-Proto} !=https
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
${closedRules}

# Old addresses (same list as next.config.mjs)
${redirectRules}

# Bots asking for /favicon.ico get the SVG icon
RewriteRule ^favicon\\.ico$ /icon.svg [L]

# Generated images are plain .png files here; pages also link the address without the extension
RewriteRule ^(opengraph-image|apple-icon)$ /$1.png [L]

# Clean addresses: /founders/x -> founders/x.html, /founders -> founders/index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{DOCUMENT_ROOT}/$1.html -f
RewriteRule ^(.+?)/?$ $1.html [L]
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.+?)/?$ $1/index.html [L]
</IfModule>

<IfModule mod_headers.c>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains"
</IfModule>

# Built files have a content hash in their name, so they can be cached for a year.
<IfModule mod_expires.c>
ExpiresActive On
<FilesMatch "\\.(js|css|woff2)$">
Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
</IfModule>

AddType image/svg+xml .svg
AddType text/plain .txt
`;
fs.writeFileSync(path.join(OUT_DIR, '.htaccess'), htaccess);

// 7. Zip with forward slashes (tar on Windows 10+, zip elsewhere).
fs.rmSync(ZIP, { force: true });
const entries = fs.readdirSync(OUT_DIR).map((n) => `"${n}"`).join(' '); // cmd.exe does not expand *
// Windows' own tar (bsdtar) writes zips. Git for Windows puts GNU tar first on PATH, which cannot.
const winTar = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe');
if (process.platform === 'win32') run(`"${winTar}" -a -c -f "${ZIP}" ${entries}`, OUT_DIR);
else run(`zip -qr "${ZIP}" .`, OUT_DIR);
log(`done: ${ZIP}`);
log(`files are also in ${OUT_DIR}`);
