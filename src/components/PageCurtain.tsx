'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Page curtain: a curved, two layer wipe between pages. Design_System 8.4.
 *
 * HOW IT WORKS
 * Next.js App Router has no built-in page transitions, so we do it in three steps:
 *   1. A capture-phase click listener spots internal link clicks and takes them over.
 *   2. router.push() starts at once, and the curtain wipes in (380ms) at the same time.
 *   3. When usePathname() changes, the new page has rendered. As soon as the curtain is
 *      fully closed and the page is in, the curtain wipes out (440ms).
 * One listener on the document covers every link on the site, so no component
 * needs to opt in, and new pages get the curtain for free.
 *
 * KEEPING IT QUICK
 * The curtain should only ever wait for its own animation, never for the network.
 * So the next page is prefetched as soon as the visitor shows intent (pointer over a
 * link, a finger down, keyboard focus), and the navigation itself starts at the click.
 * Download and render happen while the curtain is closing. If the page is ready before
 * the curtain has closed, it is hidden for those frames (data-curtain-wait).
 * The exit starts fast (ease out), so an open curtain never looks frozen.
 *
 * SAFETY NET
 * The curtain never traps the visitor. It is skipped for reduced motion, new tab
 * and modified clicks, downloads, hash links, same-page filters and /admin. If a
 * navigation stalls, a timeout lifts the curtain anyway. An interrupted animation
 * counts as finished, so the curtain can never get stuck and swallow later clicks.
 */

const EASE_IN = 'cubic-bezier(.7,0,.2,1)';
const EASE_OUT = 'cubic-bezier(.25,.7,.25,1)';
const IN_MS = 380;
const OUT_MS = 440;
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

/**
 * The internal page a link leads to, or null when the curtain should stay out of it.
 * Reads attributes, not a.href, because links inside an SVG (the Founders map) are
 * SVGAElements whose href is an object, not a string.
 */
function destination(a: Element): URL | null {
  const raw = a.getAttribute('href');
  if (!raw || raw.startsWith('#')) return null;
  const target = a.getAttribute('target');
  if (target && target !== '_self') return null;
  if (a.hasAttribute('download') || a.hasAttribute('data-no-curtain')) return null;

  const url = new URL(raw, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return null;
  // Same page: #hash jumps and filter links that only change the query string need no wipe.
  if (url.pathname === window.location.pathname) return null;
  return url;
}

/**
 * While the screen is covered, CSS animations on the page are paused (curtain.css), so the
 * new page's entrance plays when the visitor can see it, not behind the curtain.
 */
const hold = (on: boolean) => document.documentElement.toggleAttribute('data-curtain', on);

/** Hides the new page if it is ready before the curtain has fully closed (curtain.css). */
const wait = (on: boolean) => document.documentElement.toggleAttribute('data-curtain-wait', on);

// useLayoutEffect warns during server rendering, where it would do nothing anyway.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const linkOf = (t: EventTarget | null) => (t as Element | null)?.closest?.('a[href]') ?? null;

export default function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const lead = useRef<SVGSVGElement>(null);
  const main = useRef<SVGSVGElement>(null);
  const geo = useRef<ReturnType<typeof geometry>>({ w: 0, h: 0, b: 0, width: 0, d: '', before: 0, cover: 0, after: 0 }); // measured in arm(), never during render
  // idle -> closing -> closed -> opening -> idle. The new page can arrive while closing or closed.
  const phase = useRef<'idle' | 'closing' | 'closed' | 'opening'>('idle');
  const arrived = useRef(false);
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
      const anim = el!.animate([{ transform: place(from) }, { transform: place(to) }], {
        duration: ms,
        delay: delays[i],
        easing: order === 'in' ? EASE_IN : EASE_OUT,
        fill: 'both',
      });
      // finished rejects if the animation is cancelled. Treat that as done, or the
      // curtain would stay busy and every later link click would be swallowed.
      return anim.finished.catch(() => undefined).then(() => {
        el!.style.transform = place(to);
        anim.cancel();
      });
    });
    return Promise.all(runs).then(() => undefined);
  }, []);

  /** Opens the curtain once both are true: it has finished closing, and the new page is in. */
  const tryOpen = useCallback(() => {
    if (phase.current !== 'closed' || !arrived.current) return;
    phase.current = 'opening';
    window.clearTimeout(failsafe.current);
    // One frame, so the new page is painted under the closed curtain before it leaves.
    requestAnimationFrame(() => {
      wait(false);
      hold(false);
      void wipe(geo.current.cover, geo.current.after, OUT_MS, 'out').then(() => {
        [lead.current, main.current].forEach((el) => {
          if (el) el.style.visibility = 'hidden';
        });
        arm();
        phase.current = 'idle';
      });
    });
  }, [wipe, arm]);

  // The route changed, so React has committed the new page. A layout effect runs before
  // the browser paints, so if the curtain is still closing the page can be hidden in time.
  useIsoLayoutEffect(() => {
    if (phase.current !== 'closing' && phase.current !== 'closed') return;
    arrived.current = true;
    if (phase.current === 'closing') {
      wait(true); // not covered yet: keep the new page out of sight for these few frames
      hold(true);
    }
    tryOpen();
  }, [pathname, tryOpen]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const warmed = new Set<string>();

    // Fetch a page we are likely to open next. Next dedupes, but skip the call entirely once done.
    const warm = (url: URL) => {
      const key = url.pathname + url.search;
      if (warmed.has(key)) return;
      warmed.add(key);
      router.prefetch(key);
    };

    const onIntent = (e: Event) => {
      const a = linkOf(e.target);
      const url = a && destination(a);
      if (url) warm(url);
    };

    const onClick = (e: MouseEvent) => {
      if (reduce.matches || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = linkOf(e.target);
      const url = a && destination(a);
      if (!url) return;

      e.preventDefault(); // we take over, then push the route ourselves
      if (phase.current !== 'idle') return; // ignore double clicks while the curtain is moving
      phase.current = 'closing';
      arrived.current = false;

      arm(); // measure the screen now, in case it was resized or rotated
      // Navigate now, not after the curtain closes: download and render of the new page
      // run while the curtain is moving, instead of after it.
      router.push(url.pathname + url.search + url.hash);
      // If the route never changes (offline, error, a redirect back here), open anyway.
      failsafe.current = window.setTimeout(() => {
        arrived.current = true;
        tryOpen();
      }, MAX_WAIT_MS);
      void wipe(geo.current.before, geo.current.cover, IN_MS, 'in').then(() => {
        phase.current = 'closed';
        hold(true);
        tryOpen();
      });
    };

    // Coming back from the back/forward cache must never show a stuck curtain.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && phase.current !== 'idle') {
        phase.current = 'closed';
        arrived.current = true;
        tryOpen();
      }
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerover', onIntent, { passive: true });
    document.addEventListener('pointerdown', onIntent, { passive: true });
    document.addEventListener('focusin', onIntent);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerover', onIntent);
      document.removeEventListener('pointerdown', onIntent);
      document.removeEventListener('focusin', onIntent);
      window.removeEventListener('pageshow', onPageShow);
      window.clearTimeout(failsafe.current);
      hold(false);
      wait(false);
    };
  }, [router, wipe, tryOpen, arm]);

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
