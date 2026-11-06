'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/*
 * "What is Udyam Manch", acted out on a stage as the visitor scrolls (DEC-030).
 *
 * The section is tall and the scene inside it is sticky. Scroll progress (0 to 1)
 * becomes a few CSS custom properties and a `data-pose` on the section; the CSS
 * in styles/manch-stage.css draws and moves everything with transform and
 * opacity only. Nothing here sets a colour.
 *
 * The founder's walk is scrubbed, not played: the walk cycle frame comes from
 * how far he has travelled (`--ph`), so his feet never slide and he walks back
 * when the visitor scrolls back.
 *
 * Progressive enhancement: the server renders the finished scene (founder
 * talking at the mic, quotes showing, audience seated) and all five lines as a
 * list. Only with JavaScript and no reduced motion preference does the section
 * switch to the scroll story (`ms-live`).
 */

export interface StageVoice {
  quote: string;
  name: string;
  company: string;
  href: string;
}

const BEATS: { at: number; kicker: string; title: React.ReactNode; text: string }[] = [
  {
    at: 0,
    kicker: 'What is Udyam Manch?',
    title: (
      <>
        Udyam means enterprise. Manch means <mark>stage</mark>.
      </>
    ),
    text: "Put them together and you get this: a stage for the people building India's businesses.",
  },
  {
    at: 0.14,
    kicker: 'Who speaks',
    title: (
      <>
        Founders take the <mark>mic</mark>.
      </>
    ),
    text: 'No press releases. The founder walks up and tells it in their own words.',
  },
  {
    at: 0.4,
    kicker: 'What they say',
    title: (
      <>
        The real story, told <mark>straight</mark>.
      </>
    ),
    text: 'The first customer, the hard year, the thing that finally worked. Our team checks every story before it goes up.',
  },
  {
    at: 0.58,
    kicker: 'Who it is for',
    title: (
      <>
        For anyone who wants to <mark>build</mark>.
      </>
    ),
    text: 'Students, first-time founders, small-town makers and anyone with a side project. If you want to know how businesses really get built, pull up a chair.',
  },
  {
    at: 0.8,
    kicker: 'Where it goes',
    title: (
      <>
        Every story lands on the <mark>board</mark>.
      </>
    ),
    text: 'Pin the ones you want to keep. Your board stays on this device, with no account needed.',
  },
];

const c01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => c01((p - a) / (b - a));
const inOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const outBack = (t: number) => (t <= 0 ? 0 : 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2);

// The site logo, the same files the header uses.
const LOGO_LIGHT = 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto,h_120/v1792668848/logo-light.webp';
const LOGO_DARK = 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto,h_120/v1792668847/logo-dark.webp';

// Positions on the stage, in scene units (the SVG is 640 x 440).
const HIDE_X = 8; // fully behind the left curtain
const PEEK_X = 56; // head out past the curtain edge
const MIC_X = 380; // standing at the mic
const STRIDE = 74; // ground covered by one full walk cycle (two steps)

// Marigold garland: four swags under the pelmet.
const GARLAND = (() => {
  const dots: { x: number; y: number }[] = [];
  const ends = [0, 160, 320, 480, 640];
  for (let s = 0; s < 4; s++) {
    for (let k = s > 0 ? 1 : 0; k < 9; k++) {
      const t = k / 8;
      const x = ends[s] + (ends[s + 1] - ends[s]) * t;
      const y = (1 - t) ** 2 * 34 + 2 * (1 - t) * t * 74 + t ** 2 * 34;
      dots.push({ x, y });
    }
  }
  return dots;
})();

const PELMET = (() => {
  let d = 'M0 0 H640 V30';
  for (let x = 640; x > 0; x -= 80) d += ` Q${x - 40} 52 ${x - 80} 30`;
  return d + ' Z';
})();

/* ---------- The founder, drawn in parts so each joint can turn ---------- */

function Leg({ side, x }: { side: 'a' | 'b'; x: number }) {
  return (
    <g transform={`translate(${x} -50)`} className={side === 'b' ? 'ms-far' : undefined}>
      <g className={`ms-thigh ms-${side}`}>
        <path className="ms-o" d="M0 0 V25" />
        <path className="ms-pj" d="M0 0 V25" />
        <g transform="translate(0 25)">
          <g className={`ms-shin ms-${side}`}>
            <path className="ms-o" d="M0 0 V23" />
            <path className="ms-pj" d="M0 0 V23" />
            <g transform="translate(0 23)">
              <g className={`ms-ankle ms-${side}`}>
                <path className="ms-shoe" d="M-6 -1 Q-7 3 -3 3 H13 Q20 3 21 -3 Q17 -1 14 -4 Q5 -8 -6 -1 Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function Arm({ side, x }: { side: 'a' | 'b'; x: number }) {
  return (
    <g transform={`translate(${x} -47)`} className={side === 'b' ? 'ms-far' : undefined}>
      <g className={`ms-up ms-${side}`}>
        <path className="ms-o" d="M0 0 V21" />
        <path className="ms-sleeve" d="M0 0 V21" />
        <g transform="translate(0 21)">
          <g className={`ms-fore ms-${side}`}>
            <path className="ms-o ms-thin" d="M0 0 V18" />
            <path className="ms-arm-skin" d="M0 0 V18" />
            <circle className="ms-skin" cx="0" cy="21" r="5.5" />
          </g>
        </g>
      </g>
    </g>
  );
}

function Founder() {
  return (
    <g className="ms-man" filter="url(#ms-rough)">
      <ellipse className="ms-shadow" cx="4" cy="3" rx="26" ry="4.5" />
      <g className="ms-lean">
        <g className="ms-rig">
          <Leg side="b" x={-4} />
          <Leg side="a" x={4} />
          <g transform="translate(0 -50)">
            <g className="ms-upper">
              <Arm side="b" x={-6} />
              <path className="ms-kurta" d="M-12 -54 Q-18 -53 -19 -44 L-22 6 Q1 11 24 6 L20 -44 Q19 -53 13 -54 Z" />
              <path className="ms-trim" d="M-21.4 0 Q1 5 23.4 0" />
              <path className="ms-trim ms-thin" d="M4 -52 V-33" />
              <path className="ms-trim" d="M-6 -54 Q1 -48 8 -54" />
              <circle className="ms-badge" cx="12" cy="-38" r="3.6" />
              <rect className="ms-skin" x="-3" y="-62" width="8" height="10" rx="2" />
              <g transform="translate(1 -60)">
                <g className="ms-head">
                  <g transform="translate(-1 60)">
                    <circle className="ms-skin" cx="-12" cy="-79" r="5" />
                    <circle className="ms-skin" cx="2" cy="-80" r="21" />
                    <path
                      className="ms-hair"
                      d="M-20 -78 Q-23 -101 -2 -104 Q16 -107 24 -92 Q18 -97 11 -95 Q15 -101 6 -101 Q1 -95 -6 -94 Q-11 -91 -13 -84 Q-15 -80 -14 -75 Q-19 -75 -20 -78 Z"
                    />
                    <path className="ms-brow" d="M3 -91 q4 -3 8 -1 M14 -91 q4 -2 7 0" />
                    <g className="ms-eyes">
                      <ellipse className="ms-eye" cx="7" cy="-83" rx="2.5" ry="3.5" />
                      <ellipse className="ms-eye" cx="17" cy="-83.5" rx="2.2" ry="3.3" />
                    </g>
                    <path className="ms-happy" d="M4 -82 q3 -3.5 6 0 M14 -82.5 q3 -3.5 6 0" />
                    <path className="ms-line" d="M21 -80 q4.5 3 0.5 5.5" />
                    <circle className="ms-cheek" cx="9" cy="-73" r="3.8" />
                    <path className="ms-line ms-smile" d="M9 -69 q5 4.5 10 -0.5" />
                    <ellipse className="ms-mouth" cx="14" cy="-68.5" rx="4" ry="3.2" />
                  </g>
                </g>
              </g>
              <Arm side="a" x={6} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* Audience, seen from behind: a bun, a cap, a raised hand, a pagdi, a phone, long hair. */
function Crowd() {
  const X = [70, 150, 228, 318, 498, 572];
  return (
    <g className="ms-crowd">
      {X.map((x, i) => (
        <g key={x} className="ms-fan" style={{ '--d': i } as React.CSSProperties}>
          <g className="ms-fan-sway">
            {i === 0 && <circle cx={x + 8} cy="404" r="7" />}
            {i === 1 && <path d={`M${x - 14} 414 Q${x - 13} 398 ${x} 398 Q${x + 13} 398 ${x + 14} 414 Z M${x + 8} 412 h16 v4 h-16 Z`} />}
            {i === 2 && (
              <>
                <path className="ms-fan-arm" d={`M${x + 12} 444 Q${x + 22} 420 ${x + 26} 398`} />
                <circle cx={x + 27} cy="393" r="6.5" />
              </>
            )}
            {i === 3 && <path d={`M${x - 16} 418 Q${x - 18} 396 ${x} 394 Q${x + 18} 396 ${x + 16} 418 Q${x} 410 ${x - 16} 418 Z M${x} 394 q6 -6 3 -11`} />}
            {i === 4 && <rect className="ms-phone" x={x - 24} y="400" width="12" height="20" rx="2.5" />}
            {i === 5 && <path d={`M${x - 14} 416 Q${x - 18} 440 ${x - 22} 452 H${x + 22} Q${x + 18} 440 ${x + 14} 416 Z`} />}
            <circle cx={x} cy="420" r="13" />
            <path d={`M${x - 26} 454 Q${x - 24} 435 ${x} 435 Q${x + 24} 435 ${x + 26} 454 Z`} />
            {(i === 1 || i === 4) && <path className="ms-clap" d={`M${x - 20} 392 l-6 -6 M${x} 386 v-9 M${x + 20} 392 l6 -6`} />}
          </g>
        </g>
      ))}
    </g>
  );
}

export default function ManchStage({ voices }: { voices: StageVoice[] }) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [beat, setBeat] = useState(BEATS.length - 1);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setLive(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!live || !el) {
      setBeat(BEATS.length - 1);
      return;
    }
    const sticky = el.querySelector<HTMLElement>('.ms-sticky');
    const svg = el.querySelector<SVGSVGElement>('.ms-svg');
    const says = Array.from(el.querySelectorAll<HTMLElement>('.ms-say'));
    if (!sticky || !svg) return;

    let stickTop = 0;
    let raf = 0;
    let idle = 0;
    let moving = false;
    let lastX = HIDE_X;
    let dir = 1;
    let shown = -1;

    const measure = () => {
      stickTop = parseFloat(getComputedStyle(sticky).top) || 0;
    };

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - sticky.offsetHeight;
      const p = span > 0 ? c01((stickTop - r.top) / span) : 1;

      const peek = inOut(seg(p, 0.12, 0.18));
      const walk = seg(p, 0.2, 0.38);
      const x = walk > 0 ? PEEK_X + (MIC_X - PEEK_X) * walk : HIDE_X + (PEEK_X - HIDE_X) * peek;
      if (walk > 0 && walk < 1 && Math.abs(x - lastX) > 0.01) dir = x > lastX ? 1 : -1;
      lastX = x;

      let pose = 'stand';
      if (p >= 0.8) pose = 'bow';
      else if (p >= 0.43) pose = 'talk';
      else if (walk >= 1) pose = 'tap';
      else if (walk > 0) pose = moving ? 'walk' : 'stand';
      else if (p >= 0.12) pose = 'peek';
      el.dataset.pose = pose;
      el.toggleAttribute('data-start', p < 0.02);

      const s = el.style;
      s.setProperty('--open', inOut(seg(p, 0.02, 0.12)).toFixed(3));
      s.setProperty('--light', inOut(seg(p, 0.08, 0.16)).toFixed(3));
      s.setProperty('--mx', x.toFixed(1));
      s.setProperty('--dir', walk > 0 && walk < 1 ? String(dir) : '1');
      s.setProperty('--ph', ((((x - PEEK_X) / STRIDE) % 1) + 1) % 1 + '');
      s.setProperty('--aud', seg(p, 0.58, 0.74).toFixed(3));
      s.setProperty('--clap', seg(p, 0.84, 0.9).toFixed(3));

      says.forEach((b, i) => {
        const pop = outBack(seg(p, 0.44 + i * 0.06, 0.52 + i * 0.06));
        // Every note has left the frame before the stage scrolls away (p = 1).
        const fall = seg(p, 0.82 + i * 0.03, 0.92 + i * 0.03) ** 2;
        b.style.setProperty('--s', pop.toFixed(3));
        b.style.setProperty('--f', fall.toFixed(3));
        b.style.visibility = pop <= 0 || fall >= 1 || p >= 0.985 ? 'hidden' : '';
      });

      const next = BEATS.reduce((acc, b, i) => (p >= b.at ? i : acc), 0);
      if (next !== shown) {
        shown = next;
        setBeat(next);
      }
    };

    const onScroll = () => {
      moving = true;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        moving = false;
        if (!raf) raf = requestAnimationFrame(update);
      }, 220);
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(update);
    };

    // The hand-drawn line wobble only runs while the stage is on screen.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    io.observe(el);

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      for (const prop of ['--open', '--light', '--mx', '--dir', '--ph', '--aud', '--clap']) el.style.removeProperty(prop);
      el.removeAttribute('data-pose');
      el.removeAttribute('data-start');
      says.forEach((b) => {
        b.style.removeProperty('--s');
        b.style.removeProperty('--f');
        b.style.visibility = '';
      });
    };
  }, [live]);

  // Jump to a part of the story; the scene plays through on the way there.
  const goTo = (i: number) => {
    const el = ref.current;
    const sticky = el?.querySelector<HTMLElement>('.ms-sticky');
    if (!el || !sticky) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - sticky.offsetHeight;
    const stickTop = parseFloat(getComputedStyle(sticky).top) || 0;
    const at = i === 0 ? 0 : BEATS[i].at + 0.03;
    window.scrollTo({ top: top - stickTop + at * span, behavior: 'smooth' });
  };

  return (
    <section ref={ref} id="about" className={live ? 'ms ms-live' : 'ms'} aria-labelledby="ms-h">
      <h2 id="ms-h" className="sr-only">
        What Udyam Manch is
      </h2>
      <div className="ms-sticky">
        <div className="ms-copy">
          <ol className="ms-beats">
            {BEATS.map((b, i) => (
              <li key={i} className="ms-beat" data-on={i === beat ? '' : undefined}>
                <span className="ms-kick">
                  {String(i + 1).padStart(2, '0')} · {b.kicker}
                </span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
                {i === BEATS.length - 1 && (
                  <div className="ms-cta">
                    <a className="ms-btn" href="#board">
                      Start pinning stories
                    </a>
                    <Link href="/founders">Or browse all founders</Link>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="ms-foot">
            <div className="ms-rail">
              {BEATS.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  data-on={i <= beat ? '' : undefined}
                  aria-current={i === beat ? 'step' : undefined}
                  aria-label={`Part ${i + 1}: ${b.kicker}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <a className="ms-skip" href="#board">
              Skip the intro
            </a>
          </div>
        </div>

        <div className="ms-scene">
          <span className="ms-tack" data-side="l" aria-hidden="true" />
          <span className="ms-tack" data-side="r" aria-hidden="true" />
          <svg className="ms-svg" viewBox="0 0 640 440" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="ms-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" className="ms-beam-a" />
                <stop offset="1" className="ms-beam-b" />
              </linearGradient>
              {/* Hand-drawn wobble: a little noise displaces the outlines, re-rolled a few times a second. */}
              <filter id="ms-rough" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2">
                  {live && <animate attributeName="seed" values="2;5;8" dur="0.39s" repeatCount="indefinite" calcMode="discrete" />}
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="2.2" />
              </filter>
            </defs>

            <rect className="ms-wall" x="0" y="0" width="640" height="364" />

            <polygon className="ms-beam" points="384,30 436,30 540,364 290,364" fill="url(#ms-beam)" />
            <ellipse className="ms-pool" cx="414" cy="366" rx="132" ry="14" />

            <polygon className="ms-deck" points="26,362 614,362 640,386 0,386" />
            <rect className="ms-face" x="0" y="386" width="640" height="22" />
            <line className="ms-plank" x1="210" y1="362" x2="200" y2="386" />
            <line className="ms-plank" x1="430" y1="362" x2="440" y2="386" />

            <g className="ms-mic" filter="url(#ms-rough)">
              <ellipse cx="440" cy="362" rx="20" ry="4" />
              <line x1="440" y1="361" x2="440" y2="240" />
              <g transform="rotate(-28 440 240)">
                <rect x="434" y="210" width="12" height="32" rx="6" />
                <rect className="ms-grille" x="432" y="204" width="16" height="16" rx="8" />
              </g>
            </g>
            <g className="ms-waves">
              <path style={{ '--k': 0 } as React.CSSProperties} d="M440 192 q-8 -10 -20 -10" />
              <path style={{ '--k': 1 } as React.CSSProperties} d="M448 182 q-12 -16 -32 -16" />
              <path style={{ '--k': 2 } as React.CSSProperties} d="M456 172 q-16 -22 -44 -22" />
            </g>
            <text className="ms-tap" x="470" y="214">
              tap tap
            </text>

            <Founder />

            <g className="ms-curtain ms-cl">
              <path d="M0 0 H332 C318 150 330 300 318 440 H0 Z" />
              <path className="ms-fold" d="M80 30 C70 160 86 300 70 440 M160 30 C150 160 166 300 150 440 M240 30 C230 160 246 300 230 440" />
            </g>
            <g className="ms-curtain ms-cr">
              <path d="M640 0 H308 C322 150 310 300 322 440 H640 Z" />
              <path className="ms-fold" d="M560 30 C570 160 554 300 570 440 M480 30 C490 160 474 300 490 440 M400 30 C410 160 394 300 410 440" />
            </g>
            <text className="ms-hint" x="320" y="250" textAnchor="middle">
              Scroll to open the curtain
            </text>

            <path className="ms-pelmet" d={PELMET} />
            <g className="ms-garland">
              {GARLAND.map((d, i) => (
                <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r="6" data-alt={i % 2 ? '' : undefined} />
              ))}
            </g>
            <g className="ms-banner">
              <rect x="226" y="6" width="188" height="48" rx="6" />
              <image className="ms-logo ms-logo-l" href={LOGO_LIGHT} x="242" y="11" width="156" height="38" />
              <image className="ms-logo ms-logo-d" href={LOGO_DARK} x="242" y="11" width="156" height="38" />
            </g>

            <Crowd />
          </svg>

          {voices.length > 0 && (
            <ul className="ms-says" aria-label="Founders in their own words">
              {voices.slice(0, 3).map((v, i) => (
                <li key={v.href} className="ms-say" data-i={i}>
                  <Link className="ms-bub" href={v.href}>
                    <span className="ms-q">&ldquo;{v.quote}&rdquo;</span>
                    <span className="ms-who">
                      {v.name}
                      <span className="ms-co">, {v.company}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
