'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBoard } from '@/lib/board';
import MagneticDots from './MagneticDots';
import { cld } from '@/lib/cloudinary';

// Kishan's artwork, on Cloudinary like every other founder image (DEC-025).
const KISHAN_PORTRAIT = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1792668702/double-portrait-yellow-halo.webp';
const KISHAN_MAP = 'https://res.cloudinary.com/nkhny4aq/image/upload/v1792668717/india-network-map.png';

export default function PinboardHero() {
  const { pinnedItems, togglePin, isPinned } = useBoard();
  const [activeTab, setActiveTab] = useState<'editors' | 'myboard'>('editors');
  const [activeChip, setActiveChip] = useState<string>('all');

  const photoStripImages = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=600&q=70',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=70',
  ];

  const handlePin = (e: React.MouseEvent, item: { slug: string; type: 'founder' | 'story'; title: string; subtitle: string; imageUrl?: string }) => {
    e.preventDefault();
    e.stopPropagation();
    togglePin(item);
  };

  const isCardVisible = (cardType: string) => {
    if (activeChip === 'all') return true;
    return activeChip === cardType;
  };

  return (
    <section className="phero" aria-label="Pinboard hero">
      <MagneticDots />
      {/* Title & Intro */}
      <div className="pi">
        <h1>
          <span className="pw"><i>The</i></span>{' '}
          <span className="pw"><i>unvarnished</i></span>{' '}
          <mark>pins</mark>{' '}
          <span className="pw"><i>of</i></span>{' '}
          <span className="pw"><i>Indian</i></span>{' '}
          <span className="pw"><i>enterprise.</i></span>
        </h1>
        <p>A working archive of startups, founders and the business ideas that survive first contact with reality.</p>
      </div>

      {/* Scrolling Photo Strip */}
      <div className="pstrip" aria-hidden="true">
        <div className="ptrack">
          {[...photoStripImages, ...photoStripImages].map((src, i) => (
            <figure key={i}>
              <img src={src} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mbt" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'editors'}
          onClick={() => setActiveTab('editors')}
        >
          Editors&apos; board
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'myboard'}
          onClick={() => setActiveTab('myboard')}
        >
          My board <span className="mbq">{pinnedItems.length}</span>
        </button>
      </div>

      {activeTab === 'editors' ? (
        <>
          {/* Filter Chips */}
          <div className="pbchips" role="toolbar" aria-label="Filter board notes">
            <button
              className="pbchip"
              aria-pressed={activeChip === 'all'}
              onClick={() => setActiveChip('all')}
            >
              Everything
            </button>
            <button
              className="pbchip"
              aria-pressed={activeChip === 'story'}
              onClick={() => setActiveChip('story')}
            >
              Stories
            </button>
            <button
              className="pbchip"
              aria-pressed={activeChip === 'founder'}
              onClick={() => setActiveChip('founder')}
            >
              Founders
            </button>
            <button
              className="pbchip"
              aria-pressed={activeChip === 'startup'}
              onClick={() => setActiveChip('startup')}
            >
              Startups
            </button>
          </div>

          {/* Pinned Notes Board */}
          <div className="pbboard">
            {/* 1. Lead Cover Story: Kishan Panchal */}
            {isCardVisible('founder') && (
              <article
                className="pbcard pblead"
                style={{ '--r': '-.8deg' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('kishan-panchal-farming-solutions-india')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'kishan-panchal-farming-solutions-india',
                      type: 'founder',
                      title: "Kishan for Kisan: From Rajasthan's Soil to Farms Across India.",
                      subtitle: 'Farming Solutions India',
                      imageUrl: KISHAN_PORTRAIT,
                    })
                  }
                  data-tip={isPinned('kishan-panchal-farming-solutions-india') ? 'Pinned. Click to unpin' : 'Pin to My board'}
                  aria-label="Pin Kishan Panchal story"
                />
                <span className="pbtag">Founder Story</span>
                <h2>
                  <Link href="/founders/kishan-panchal-farming-solutions-india">
                    Kishan for Kisan: From Rajasthan&apos;s Soil to Farms Across India.
                  </Link>
                </h2>
                <p>
                  How Kishan Panchal turned decades of on-ground experience into Farming Solutions India, building real solutions for farmers across Rajasthan and 10+ states in India.
                </p>
                <div className="pbart">
                  <Link href="/founders/kishan-panchal-farming-solutions-india">
                    <img
                      src={cld(KISHAN_PORTRAIT, 'c_limit,w_640')}
                      alt="Kishan Panchal, Founder of Farming Solutions India"
                      loading="lazy"
                    />
                  </Link>
                </div>
                <span className="pbmeta">Kishan Panchal · 8 min read</span>
              </article>
            )}

            {/* 2. Founder Voice Quote */}
            {isCardVisible('founder') && (
              <article
                className="pbcard pbquote pbs4"
                style={{ '--i': 1, '--r': '1.2deg', '--c': '#5299D3' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('quote-kishan-voice')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'quote-kishan-voice',
                      type: 'founder',
                      title: 'The field is the real business school.',
                      subtitle: 'Kishan Panchal · Founder voice',
                    })
                  }
                  data-tip="Pin to My board"
                  aria-label="Pin quote"
                />
                <span className="pbtag">Founder voice</span>
                <p>“Every farmer teaches you something. The field is the real business school.”</p>
                <span className="pbmeta">Kishan Panchal · Farming Solutions India</span>
              </article>
            )}

            {/* 3. Startup to Know: Farming Solutions India */}
            {isCardVisible('startup') && (
              <article
                className="pbcard pbsu pbs4"
                style={{ '--i': 2, '--r': '-1deg', '--c': '#E0457B' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('startup-farming-solutions')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'startup-farming-solutions',
                      type: 'founder',
                      title: 'Farming Solutions India',
                      subtitle: 'Agritech · Jaipur',
                    })
                  }
                  data-tip="Pin to My board"
                  aria-label="Pin startup"
                />
                <span className="pbtag">Startup to know</span>
                <div className="pbart" style={{ minHeight: '120px', background: 'var(--board)', overflow: 'hidden' }}>
                  <img
                    src={cld(KISHAN_MAP, 'c_limit,w_640')}
                    alt="Farming Solutions India project map"
                    loading="lazy"
                  />
                </div>
                <h3>Farming Solutions India</h3>
                <dl>
                  <dt>Industry</dt>
                  <dd>Agritech</dd>
                  <dt>HQ</dt>
                  <dd>Jaipur</dd>
                  <dt>Founded</dt>
                  <dd>2006</dd>
                </dl>
                <span className="pbmeta">
                  <a
                    href="https://farmingsolutions.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--acc)', fontWeight: 600, position: 'relative', zIndex: 4 }}
                  >
                    farmingsolutions.in ↗
                  </a>
                </span>
              </article>
            )}

            {/* 4. Interview Card */}
            {isCardVisible('founder') && (
              <article
                className="pbcard pbs4b"
                style={{ '--i': 3, '--r': '.7deg' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('story-two-engineers')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'story-two-engineers',
                      type: 'story',
                      title: 'Two engineers, one chai stall, and a payments idea',
                      subtitle: 'Interview',
                    })
                  }
                  data-tip="Pin to My board"
                  aria-label="Pin interview"
                />
                <span className="pbtag">Interview</span>
                <h3 style={{ fontSize: '28px', fontWeight: 700 }}>
                  Two engineers, one chai stall, and a payments idea
                </h3>
                <div className="pbart" style={{ background: 'var(--board)', minHeight: '110px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70"
                    alt="Team working together"
                    loading="lazy"
                  />
                </div>
                <span className="pbmeta">Sample · 12 min read</span>
              </article>
            )}

            {/* 5. Editor's Note */}
            {isCardVisible('story') && (
              <article
                className="pbcard pbnote pbs3"
                style={{ '--i': 4, '--r': '-2deg' } as React.CSSProperties}
              >
                <span className="pbtag" style={{ color: 'inherit' }}>Editor&apos;s note</span>
                <h3>Every profile is checked by a human first.</h3>
                <p>Submitting a form never publishes anything.</p>
              </article>
            )}

            {/* 6. Case Study: 3x repeat orders */}
            {isCardVisible('story') && (
              <article
                className="pbcard pbs3"
                style={{ '--i': 5, '--r': '1.4deg' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('story-case-study-3x')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'story-case-study-3x',
                      type: 'story',
                      title: 'D2C brand tripled repeat orders',
                      subtitle: 'Case study',
                    })
                  }
                  data-tip="Pin to My board"
                  aria-label="Pin case study"
                />
                <span className="pbtag">Case study</span>
                <div className="pbbig">3×</div>
                <div className="pbart" style={{ minHeight: '110px', background: 'var(--board)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=70"
                    alt="Warehouse parcels"
                    loading="lazy"
                  />
                </div>
                <p>A bootstrapped D2C brand tripled repeat orders by fixing one thing: delivery promises.</p>
                <span className="pbmeta">Sample · 6 min</span>
              </article>
            )}

            {/* 7. Startup: Logistics */}
            {isCardVisible('startup') && (
              <article
                className="pbcard pbsu pbs4b"
                style={{ '--i': 6, '--r': '-.8deg', '--c': 'var(--blue)' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('startup-sample-logistics')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'startup-sample-logistics',
                      type: 'founder',
                      title: 'Sample Co. Logistics',
                      subtitle: 'Logistics · Ahmedabad',
                    })
                  }
                  data-tip="Pin to My board"
                  aria-label="Pin startup"
                />
                <span className="pbtag">Startup to know</span>
                <div className="pbart" style={{ minHeight: '120px', background: 'var(--board)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=70"
                    alt="Storage hall"
                    loading="lazy"
                  />
                </div>
                <h3>Sample Co. Logistics</h3>
                <dl>
                  <dt>Industry</dt>
                  <dd>Logistics</dd>
                  <dt>HQ</dt>
                  <dd>Ahmedabad</dd>
                  <dt>Founded</dt>
                  <dd>2019</dd>
                </dl>
                <span className="pbmeta">Placeholder profile</span>
              </article>
            )}

            {/* 8. Newsletter Card */}
            {isCardVisible('story') && (
              <article
                className="pbcard pbnews pbs4b"
                style={{ '--i': 7, '--r': '.9deg', '--c': '#E0457B' } as React.CSSProperties}
              >
                <span className="pbtag">Newsletter</span>
                <h3 style={{ fontSize: '26px', fontWeight: 700 }}>One email, every Sunday.</h3>
                <p>The week&apos;s best story and one startup worth watching.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const btn = (e.currentTarget.querySelector('button') as HTMLButtonElement);
                    if (btn) btn.textContent = 'You are on the list';
                  }}
                >
                  <label
                    style={{ fontSize: '13px', display: 'block', marginBottom: '4px', fontFamily: 'var(--hd)' }}
                    htmlFor="pbem"
                  >
                    Email address
                  </label>
                  <input id="pbem" type="email" required placeholder="you@company.com" />
                  <button type="submit" style={{ marginTop: '8px' }}>
                    Subscribe
                  </button>
                </form>
              </article>
            )}

            {/* 9. Founder Journey Card */}
            {isCardVisible('founder') && (
              <article
                className="pbcard pbs4"
                style={{ '--i': 8, '--r': '-1.2deg' } as React.CSSProperties}
              >
                <button
                  className="mbpc"
                  aria-pressed={isPinned('founder-pune-hostel')}
                  onClick={(e) =>
                    handlePin(e, {
                      slug: 'founder-pune-hostel',
                      type: 'founder',
                      title: 'From a Pune hostel room to a 40 person team',
                      subtitle: 'Founder journey',
                    })
                  }
                  data-tip="Pin to My board"
                  aria-label="Pin founder"
                />
                <span className="pbtag">Founder journey</span>
                <h3 style={{ fontSize: '30px', fontWeight: 700 }}>From a Pune hostel room to a 40 person team</h3>
                <div className="pbart" style={{ minHeight: '120px', background: 'var(--board)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=800&q=70"
                    alt="Team meeting"
                    loading="lazy"
                  />
                </div>
                <p>Four pivots, one near shutdown, and a hiring rule the founder still swears by.</p>
                <span className="pbmeta">Sample · 10 min read</span>
              </article>
            )}
          </div>
        </>
      ) : (
        /* My Board Tab View */
        <div className="mbb">
          {pinnedItems.length === 0 ? (
            <div className="mbe">
              Your board is empty. Pin stories or founders from the Editors&apos; board above to build your collection.
            </div>
          ) : (
            pinnedItems.map((item, idx) => (
              <div
                key={item.slug}
                className="mbn s"
                style={{
                  '--r': `${(idx % 2 === 0 ? 1 : -1) * 1.5}deg`,
                  top: `${20 + (idx % 3) * 160}px`,
                  left: `${20 + (idx % 4) * 260}px`,
                } as React.CSSProperties}
              >
                <button
                  className="mbp"
                  onClick={() => togglePin(item)}
                  title="Remove from My board"
                  aria-label="Remove pin"
                />
                <span className="mbg">{item.type === 'founder' ? 'Founder' : 'Story'}</span>
                <h3>
                  <Link href={item.type === 'founder' ? `/founders/${item.slug}` : `/stories/${item.slug}`}>
                    {item.title}
                  </Link>
                </h3>
                <p>{item.subtitle}</p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
