import type { ReactNode } from 'react';
import type { FounderJourney, Layout } from '@/lib/journey/types';
import { chaptersOf, titled } from '@/lib/journey/chapters';
import { basedIn } from '@/lib/journey/facts';
import { plain } from '@/lib/journey/format';
import Breadcrumb from '../Breadcrumb';
import JourneyHero from '../JourneyHero';
import FactsStrip from '../FactsStrip';
import JourneyBody, { Block } from '../blocks';
import JourneyEnd, { CompanyPanel, KeepReading, ShareAndPin, SideQuote, StatsAndFeatures, Topics } from '../JourneyEnd';
import JourneyFx from '../JourneyFx';
import ShareDock from '../ShareDock';
import ChapterNav from '../ChapterNav';
import StoryBar from '../StoryBar';
import ShareControls from '../ShareControls';

export interface LayoutProps {
  j: FounderJourney;
  related: FounderJourney[];
  url: string;
  minutes: number;
}

const crumbs = (j: FounderJourney) => [{ label: 'Founders', href: '/founders' }, { label: j.founder.shortName ?? j.founder.name }];

/** Everything every layout needs around its composition: effects, dock and the reading progress. */
function Chrome({ j, url, children, dockClass = '' }: { j: FounderJourney; url: string; children: ReactNode; dockClass?: string }) {
  return (
    <>
      {children}
      <JourneyFx key={j.slug} slug={j.slug} />
      <ShareDock url={url} title={plain(j.hero.title)} className={dockClass} />
    </>
  );
}

/** A. Cover story: title first, facts row, one centred column, end of story wrap. */
export function CoverLayout({ j, related, url, minutes }: LayoutProps) {
  return (
    <Chrome j={j} url={url}>
      <div className="w fj-page" data-fj-layout="cover">
        <Breadcrumb items={crumbs(j)} />
        <article className="fj-story">
          <JourneyHero j={j} minutes={minutes} url={url} />
          <FactsStrip j={j} />
          <div className="fj-article">
            <JourneyBody blocks={j.body} />
          </div>
          <JourneyEnd j={j} related={related} url={url} />
        </article>
      </div>
    </Chrome>
  );
}

/** B. Dossier: text-led hero, a short sticky profile rail with a chapter list, details after the story. */
export function DossierLayout({ j, related, url, minutes }: LayoutProps) {
  const chapters = titled(chaptersOf(j.body)).map((c) => ({ id: c.id, title: c.title! }));
  const where = basedIn(j);
  return (
    <Chrome j={j} url={url} dockClass="fj-dock--rail">
      <div className="w fj-page" data-fj-layout="dossier">
        <Breadcrumb items={crumbs(j)} />
        <article className="fj-story">
          <JourneyHero j={j} minutes={minutes} url={url} />
          <div className="fj-cols">
            <div className="fj-article">
              <JourneyBody blocks={j.body} />
            </div>
            <aside className="fj-rail" aria-label="Story profile">
              <CompanyPanel j={j} compact />
              <dl className="fj-railfacts">
                <div><dt>Founder</dt><dd>{j.founder.name}</dd></div>
                {j.company.industry && <div><dt>Industry</dt><dd>{j.company.industry}</dd></div>}
                {where && <div><dt>Based in</dt><dd>{where}</dd></div>}
                {j.company.founded && <div><dt>Founded</dt><dd>{j.company.founded}</dd></div>}
              </dl>
              <ChapterNav chapters={chapters} />
              <div className="fj-railshare">
                <ShareControls url={url} title={plain(j.hero.title)} medium="share_rail" />
              </div>
            </aside>
          </div>
          <aside className="fj-end fj-band" aria-label="More about this story">
            <div className="fj-endpanel is-single" data-rv>
              <StatsAndFeatures j={j} />
            </div>
            <SideQuote j={j} />
            <div className="fj-endrow" data-rv>
              <ShareAndPin j={j} url={url} />
              <Topics j={j} />
            </div>
            <KeepReading related={related} />
          </aside>
        </article>
      </div>
    </Chrome>
  );
}

/** C. Chapters: full-bleed hero band, numbered chapters with margin labels, docked story bar. */
export function ChaptersLayout({ j, related, url, minutes }: LayoutProps) {
  const chapters = chaptersOf(j.body);
  const links = titled(chapters).map((c) => ({ id: c.id, title: c.title! }));
  const total = chapters.length;
  return (
    <Chrome j={j} url={url}>
      <div className="fj-page" data-fj-layout="chapters">
        <div className="fj-bandwrap">
          <div className="w">
            <Breadcrumb items={crumbs(j)} />
            <JourneyHero j={j} minutes={minutes} url={url} />
            <ChapterNav chapters={links} />
          </div>
        </div>
        <StoryBar company={j.company.name} chapters={links} url={url} title={plain(j.hero.title)} />
        <div className="w">
          <FactsStrip j={j} />
          <div className="fj-article">
            {chapters.map((c, n) => (
              <div key={c.id} className="fj-chapter">
                {c.title ? (
                  <p className="fj-chlabel" aria-hidden="true">
                    <span>{String(n + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
                  </p>
                ) : (
                  <span />
                )}
                <div className="fj-chbody">
                  {c.blocks.map((b) => (
                    <Block key={b._key} b={b} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <aside className="fj-end" aria-label="About the company and more stories">
            <div className="fj-endpanel" data-rv>
              <CompanyPanel j={j} />
              <StatsAndFeatures j={j} />
            </div>
            <SideQuote j={j} />
            <div className="fj-endrow" data-rv>
              <ShareAndPin j={j} url={url} />
              <Topics j={j} />
            </div>
            <KeepReading related={related} />
          </aside>
        </div>
      </div>
    </Chrome>
  );
}

export const LAYOUT_COMPONENTS: Record<Layout, (p: LayoutProps) => JSX.Element> = {
  cover: CoverLayout,
  dossier: DossierLayout,
  chapters: ChaptersLayout,
};
