'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Page curtain: a curved, two layer wipe between pages. Design_System 8.4.
 *
 * HOW IT WORKS
 * Next.js App Router has no built-in page transitions, so we do it in three steps:
 *   1. A capture-phase click listener spots internal link clicks and holds the navigation.
 *   2. The curtain wipes in (380ms), then we call router.push().
 *   3. When usePathname() changes, the new page has rendered, so the curtain wipes out (480ms).
 * One listener on the document covers every link on the site, so no component
 * needs to opt in, and new pages get the curtain for free.
 *
 * SAFETY NET
 * The curtain never traps the visitor. It is skipped for reduced motion, new tab
 * and modified clicks, downloads, hash links, same-page filters and /admin. If a
 * navigation stalls, a timeout lifts the curtain anyway.
 */

const EASE = 'cubic-bezier(.7,0,.2,1)';
const IN_MS = 380;
const OUT_MS = 480;
const STAGGER_MS = 70;
const MAX_WAIT_MS = 4000;

/**
 * Geometry of the curved band, measured in pixels for the current screen.
 *   w = screen width, h = screen height, b = how far the edges bulge.
 * The band is one shape with BOTH edges curving the same way, like a thick ")":
 *   leading edge  (right side) bulges forward, so it enters as a round wave;
 *   trailing edge (left side) is hollowed, so it leaves as a crescent.
 * Resting positions (translateX of the band):
 *   before = -(w + 2b)  fully off the left
 *   cover  = -b         the screen is completely covered
 *   after  = w          fully off the right
 */
function geometry() {
  const w = window.innerWidth;
  const h = window.innerHeight + 2; // 1px overscan top and bottom, so no hairline gaps
  const b = Math.round(Math.min(window.innerHeight * 0.28, w * 0.4));
  const L = w + b; // x of the leading edge at the top and bottom
  const d = `M0 0H${L}Q${L + 2 * b} ${h / 2} ${L} ${h}H0Q${2 * b} ${h / 2} 0 0Z`;
  return { w, h, b, width: L + b + 2, d, before: -(w + 2 * b), cover: -b, after: w };
}

function skipLink(a: HTMLAnchorElement, e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0) return true;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return true;
  if (a.target && a.target !== '_self') return true;
  if (a.hasAttribute('download') || a.hasAttribute('data-no-curtain')) return true;

  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return true;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return true;
  // Same page: #hash jumps and filter links that only change the query string need no wipe.
  if (url.pathname === window.location.pathname) return true;
  return false;
}

export default function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const lead = useRef<SVGSVGElement>(null);
  const main = useRef<SVGSVGElement>(null);
  const geo = useRef<ReturnType<typeof geometry>>({ w: 0, h: 0, b: 0, width: 0, d: '', before: 0, cover: 0, after: 0 }); // measured in arm(), never during render
  const covered = useRef(false);
  const busy = useRef(false);
  const failsafe = useRef<number>();

  const place = (x: number) => `translateX(${x}px)`;

  /** Size the band for the current screen and park it off to the left. */
  const arm = useCallback(() => {
    const g = (geo.current = geometry());
    [lead.current, main.current].forEach((el) => {
      if (!el) return;
      el.setAttribute('width', String(g.width));
      el.setAttribute('height', String(g.h));
      el.setAttribute('viewBox', `0 0 ${g.width} ${g.h}`);
      el.querySelector('path')?.setAttribute('d', g.d);
      el.style.transform = place(g.before);
    });
  }, []);

  const wipe = useCallback((from: number, to: number, ms: number, order: 'in' | 'out') => {
    const layers = [lead.current, main.current];
    if (!layers[0] || !layers[1]) return Promise.resolve();
    // In: the lead layer arrives first and the main layer follows over it,
    // so the lead colour shows as a bright edge on the wave.
    // Out: the main layer leaves first and the lead layer trails behind.
    const delays = order === 'in' ? [0, STAGGER_MS] : [STAGGER_MS, 0];
    const runs = layers.map((el, i) => {
      el!.style.visibility = 'visible';
      return el!
        .animate([{ transform: place(from) }, { transform: place(to) }], {
          duration: ms,
          delay: delays[i],
          easing: EASE,
          fill: 'both',
        })
        .finished.then((anim) => {
          el!.style.transform = place(to);
          anim.cancel();
        });
    });
    return Promise.all(runs).then(() => undefined);
  }, []);

  const reveal = useCallback(async () => {
    window.clearTimeout(failsafe.current);
    if (!covered.current) return;
    await wipe(geo.current.cover, geo.current.after, OUT_MS, 'out');
    [lead.current, main.current].forEach((el) => {
      if (el) el.style.visibility = 'hidden';
    });
    arm();
    covered.current = false;
    busy.current = false;
  }, [wipe, arm]);

  // The route changed, so the new page is on screen. Wait two frames so it has painted.
  useEffect(() => {
    if (!covered.current) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => void reveal()));
    return () => cancelAnimationFrame(id);
  }, [pathname, reveal]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onClick = (e: MouseEvent) => {
      if (reduce.matches) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || skipLink(a, e)) return;

      e.preventDefault(); // we take over, then push the route ourselves
      if (busy.current) return; // ignore double clicks while the curtain is moving
      busy.current = true;

      const href = a.href;
      const url = new URL(href);
      arm(); // measure the screen now, in case it was resized or rotated
      wipe(geo.current.before, geo.current.cover, IN_MS, 'in').then(() => {
        covered.current = true;
        router.push(url.pathname + url.search + url.hash);
        // If the route never changes (offline, error), lift the curtain anyway.
        failsafe.current = window.setTimeout(() => void reveal(), MAX_WAIT_MS);
      });
    };

    // Coming back from the back/forward cache must never show a stuck curtain.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        covered.current = true;
        void reveal();
      }
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pageshow', onPageShow);
      window.clearTimeout(failsafe.current);
    };
  }, [router, wipe, reveal, arm]);

  useEffect(() => arm(), [arm]);

  return (
    <div className="pc" aria-hidden="true">
      <svg className="pc-lead" ref={lead} preserveAspectRatio="none">
        <path />
      </svg>
      <svg className="pc-main" ref={main} preserveAspectRatio="none">
        <path />
      </svg>
    </div>
  );
}
