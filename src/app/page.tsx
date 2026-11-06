import React from 'react';
import Link from 'next/link';
import PinboardHero from '@/components/PinboardHero';
import NewsletterBand from '@/components/NewsletterBand';
import ManchStage, { type StageVoice } from '@/components/ManchStage';
import { getFeed } from '@/lib/content';
import { getJourneys } from '@/lib/journey/repo';

export const revalidate = 300;

export default async function HomePage() {
  const stories = (await getFeed()).slice(0, 6);

  const journeys = await getJourneys();
  // Real items only. Samples are used just to fill the strip if there are fewer than four real ones.
  const trendingItems = [...stories.filter((x) => !x.sample), ...stories.filter((x) => x.sample)]
    .slice(0, 4)
    .map((x, i) => ({ num: String(i + 1), title: x.title, href: x.href, sample: x.sample }));

  // The pull quote comes from a real journey's sidebar, so it is never invented.
  const quoteSource = journeys.find((j) => !j.sample && j.sidebar.quote);
  const quote = quoteSource?.sidebar.quote;

  // Built from the founder journeys, so a newly published founder appears here too.
  const directoryCompanies = journeys.slice(0, 5).map((j) => ({
    name: j.company.name,
    desc: j.company.summary,
    ind: j.company.industry ?? '',
    city: j.company.city ?? j.founder.location ?? '',
    yr: j.company.founded ?? '',
    href: `/founders/${j.slug}`,
    sample: j.sample,
  }));

  // Speech bubbles on the stage: each founder's own short quote, never invented.
  // Skip a quote that opens with the same word as one already picked, so they read differently.
  const voices: StageVoice[] = [];
  for (const j of journeys) {
    const quote = j.hero.stage?.quote;
    if (j.sample || !quote) continue;
    const first = quote.split(' ')[0].toLowerCase();
    if (voices.some((v) => v.quote.split(' ')[0].toLowerCase() === first)) continue;
    voices.push({ quote, name: j.founder.name, company: j.company.name, href: `/founders/${j.slug}` });
    if (voices.length === 3) break;
  }

  return (
    <div className="w">
      {/* 1. Pinboard Hero (Full Bleed), with the stage story before the board */}
      <PinboardHero stage={<ManchStage voices={voices} />} />

      {/* 2. Trending Strip */}
      <section className="trend" aria-label="Trending">
        {trendingItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <b>{item.num}</b>
            <span>
              {item.sample && <small>Sample</small>}
              {item.title}
            </span>
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
            {stories.map((s) => (
              <Link key={s.href} href={s.href}>
                <span className="meta">{s.date}</span>
                <span>
                  <span className="cat">
                    {s.category}
                    {s.sample && <b> · Sample</b>}
                  </span>
                  <h3>{s.title}</h3>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {quote && quoteSource && (
          <aside>
            <div className="quote">
              <p>{quote.text}</p>
              <div className="who">
                <div className="pt" style={{ background: 'var(--indigo)', width: 46, height: 46 }} aria-hidden="true">
                  {quoteSource.founder.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <span>
                  {quoteSource.founder.name}
                  <br />
                  <span className="meta" style={{ color: 'inherit', opacity: 0.7 }}>
                    Founder, {quoteSource.company.name}
                  </span>
                </span>
              </div>
            </div>
            <p className="meta" style={{ marginTop: 14 }}>
              From our founder stories.{' '}
              <Link href={`/founders/${quoteSource.slug}`} style={{ color: 'var(--acc)' }}>
                <b>Read the full story</b>
              </Link>
            </p>
          </aside>
        )}
      </div>

      {/* 4. Directory Preview */}
      <section>
        <div className="sec">
          <h2>From the directory</h2>
          <Link href="/founders">Search all companies</Link>
        </div>
        <div className="rows">
          {directoryCompanies.map((c) => (
            <Link key={c.href} href={c.href}>
              <h3>{c.name}</h3>
              <p>
                {c.sample && <b>Sample. </b>}
                {c.desc}
              </p>
              <span className="meta">
                {[c.ind, c.city].filter(Boolean).join(', ')}
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
