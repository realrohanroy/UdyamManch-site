'use client';

import { useEffect } from 'react';

/**
 * Motion layer for the Founders page. Renders nothing. Everything here is
 * progressive: the page is fully readable without it, and with reduced motion
 * nothing animates. Looks for these hooks inside .fd-root:
 *   [data-count]  numbers that count up      .fd-rv   reveal on scroll
 *   .fd-card      tilt and light             .fd-ix a  portrait follows the cursor
 *   .fd-mag       button leans to the cursor
 */
export default function FoundersFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.fd-root');
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hover = matchMedia('(hover: hover)').matches;
    const off: Array<() => void> = [];

    const counters = root.querySelectorAll<HTMLElement>('[data-count]');
    if (reduce) {
      counters.forEach((el) => el.classList.add('fd-ready'));
      root.querySelectorAll('.fd-rv').forEach((el) => el.classList.add('in'));
      return;
    }
    root.setAttribute('data-fx', '');

    counters.forEach((el) => {
      const to = Number(el.dataset.count);
      let t0: number | null = null;
      const id = window.setTimeout(() => {
        const step = (ts: number) => {
          t0 ??= ts;
          const k = Math.min((ts - t0) / 1400, 1);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      }, 700);
      off.push(() => window.clearTimeout(id));
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.25 },
    );
    root.querySelectorAll('.fd-rv').forEach((el) => io.observe(el));
    off.push(() => io.disconnect());

    if (hover) {
      const onMove = (e: MouseEvent) => {
        const t = e.target as Element;
        const card = t.closest<HTMLElement>('.fd-card');
        if (card) {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          card.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg) translateY(-4px)`;
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
        }
        const row = t.closest<HTMLElement>('.fd-ix a');
        const pv = document.getElementById('fd-pv');
        if (pv) {
          if (row) {
            pv.className = `fd-pv on fd-tone-${row.dataset.tone ?? 0}`;
            pv.textContent = row.dataset.ini ?? '';
            pv.style.transform = `translate(${e.clientX + 26}px, ${e.clientY - 70}px)`;
          } else pv.classList.remove('on');
        }
        const mag = t.closest<HTMLElement>('.fd-mag');
        if (mag) {
          const r = mag.getBoundingClientRect();
          mag.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        }
      };
      const onOut = (e: MouseEvent) => {
        const t = e.target as Element;
        const card = t.closest<HTMLElement>('.fd-card');
        if (card && !card.contains(e.relatedTarget as Node)) card.style.transform = '';
        const mag = t.closest<HTMLElement>('.fd-mag');
        if (mag && !mag.contains(e.relatedTarget as Node)) mag.style.transform = '';
      };
      root.addEventListener('mousemove', onMove);
      root.addEventListener('mouseout', onOut);
      off.push(() => { root.removeEventListener('mousemove', onMove); root.removeEventListener('mouseout', onOut); });
    }
    return () => off.forEach((f) => f());
  }, []);

  return <div id="fd-pv" className="fd-pv" aria-hidden="true" />;
}
