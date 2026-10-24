import React from 'react';
import Link from 'next/link';
import PinboardHero from '@/components/PinboardHero';
import NewsletterBand from '@/components/NewsletterBand';
import { getStories, getFounders } from '@/lib/content';

export const revalidate = 300;

export default async function HomePage() {
  const [stories, founders] = await Promise.all([getStories(), getFounders()]);

  const trendingItems = [
    { num: '1', title: 'Why the next wave of Indian founders is choosing Jaipur, Pune and Rajkot over Bengaluru', href: '/stories' },
    { num: '2', title: 'The hidden economics of Tier-2 hardware manufacturing', href: '/stories/beyond-the-metro-moat-tier-2-manufacturing' },
    { num: '3', title: "Kishan for Kisan: From Rajasthan's Soil to Farms Across India", href: '/founders/kishan-panchal-farming-solutions-india' },
    { num: '4', title: 'Bootstrapping to ₹50 Cr with zero venture capital', href: '/stories' },
  ];

  const directoryCompanies = [
    { name: 'Farming Solutions India', desc: 'Agricultural engineering, polyhouse infrastructure & drip networks.', ind: 'Agritech', city: 'Jaipur', yr: '2006', href: '/founders/kishan-panchal-farming-solutions-india' },
    { name: 'Desert Loom Collective', desc: 'Natural dye textiles and micro-cooperatives for 800+ desert weavers.', ind: 'Textiles', city: 'Barmer', yr: '2018', href: '/founders/sunita-meena-desert-loom-crafts' },
    { name: 'Aarav Precision Hydraulics', desc: 'Aerospace tolerance hydraulic valves for agricultural tractors.', ind: 'Manufacturing', city: 'Rajkot', yr: '2014', href: '/founders/arjun-somani-aarav-hydraulics' },
    { name: 'Samriddhi Micro Cold Storage', desc: 'Solar powered cold rooms for rural farm clusters.', ind: 'Agritech', city: 'Pune', yr: '2021', href: '/founders' },
    { name: 'Kisan Vani AI', desc: 'Vernacular voice advisory for pest diagnosis across 8 regional dialects.', ind: 'AI / Software', city: 'Indore', yr: '2023', href: '/founders' },
  ];

  return (
    <div className="w">
      {/* 1. Pinboard Hero (Full Bleed) */}
      <PinboardHero />

      {/* 2. Trending Strip */}
      <section className="trend" aria-label="Trending">
        {trendingItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <b>{item.num}</b>
            <span>{item.title}</span>
          </Link>
        ))}
      </section>

      {/* 3. Two Column: Latest Stories & Quote */}
      <div className="two">
        <section>
          <div className="sec">
            <h2>Latest</h2>
            <Link href="/stories">All stories</Link>
          </div>
          <div className="feed">
            {stories.map((s, i) => (
              <Link key={s.slug || i} href={`/stories/${s.slug}`}>
                <span className="meta">{i === 0 ? '2h ago' : `${i + 1}d ago`}</span>
                <span>
                  <span className="cat">{s.category}</span>
                  <h3>{s.title}</h3>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside>
          <div className="quote">
            <p>We did not need more orders. We needed the weavers to stop waiting thirty days to be paid.</p>
            <div className="who">
              <div className="pt" style={{ background: 'var(--indigo)', width: 46, height: 46 }}>
                MD
              </div>
              <span>
                Meera Desai
                <br />
                <span className="meta" style={{ color: 'inherit', opacity: 0.7 }}>
                  Founder, Tanta Textiles
                </span>
              </span>
            </div>
          </div>
          <p className="meta" style={{ marginTop: 14 }}>
            From our founder interview series.{' '}
            <Link href="/founders" style={{ color: 'var(--acc)' }}>
              <b>Read founder stories</b>
            </Link>
          </p>
        </aside>
      </div>

      {/* 4. Directory Preview */}
      <section>
        <div className="sec">
          <h2>From the directory</h2>
          <Link href="/founders">Search all companies</Link>
        </div>
        <div className="rows">
          {directoryCompanies.map((c, idx) => (
            <Link key={idx} href={c.href}>
              <h3>{c.name}</h3>
              <p>{c.desc}</p>
              <span className="meta">
                {c.ind}, {c.city}
              </span>
              <span className="meta">{c.yr}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Newsletter Band with Asymmetric Radius */}
      <NewsletterBand />
    </div>
  );
}
