'use client';

import { useEffect, useRef, useState } from 'react';
import { TOAST_EVENT } from '@/lib/journey/toast';

/**
 * The only scroll and motion script on the reading page. It draws the reading progress bar
 * and the toast, and runs scroll reveals. Design_System 8.4, UI-SPEC section 9.
 *
 * Safety: hidden states are added only to blocks that are still below the fold, and only
 * when motion is allowed, so a script failure or reduced motion leaves everything visible.
 */
export default function JourneyFx({ slug }: { slug: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState('');
  const timer = useRef<number>();

  // Progress bar: how far through the article body the reader is.
  useEffect(() => {
    const article = document.querySelector<HTMLElement>('.fj-article');
    if (!article || !bar.current) return;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total));
      bar.current!.style.transform = `scaleX(${p})`;
      bar.current!.style.opacity = window.scrollY > 8 ? '1' : '0';
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [slug]);

  // Scroll reveals, once only.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'));
    const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    below.forEach((el) => el.classList.add('fj-rv-pre'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('fj-in');
          el.classList.remove('fj-rv-pre');
          io.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    below.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  // Toast.
  useEffect(() => {
    const on = (e: Event) => {
      setToast(String((e as CustomEvent).detail ?? ''));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(''), 3000);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => {
      window.removeEventListener(TOAST_EVENT, on);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <div className="fj-progress" ref={bar} aria-hidden="true" />
      <div className={`fj-toast${toast ? ' is-on' : ''}`} role="status">
        {toast}
      </div>
    </>
  );
}
