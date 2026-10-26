import type { FounderJourney } from '@/lib/journey/types';
import Breadcrumb from '../Breadcrumb';
import LegacyHero from './LegacyHero';
import LegacyBody from './LegacyBody';
import LegacySidebar from './LegacySidebar';

/**
 * The founder story layout that is live on the site: hero, article and a sticky sidebar.
 * The redesigned layouts (cover, dossier, chapters) are only reachable at /preview while
 * a layout is being chosen. Classes use the fl prefix (styles/legacy-journey.css).
 */
export default function LegacyLayout({ j, related, url, minutes }: { j: FounderJourney; related: FounderJourney[]; url: string; minutes: number }) {
  return (
    <div className="w">
      <Breadcrumb items={[{ label: 'Founders', href: '/founders' }, { label: j.founder.shortName ?? j.founder.name }]} />
      <LegacyHero j={j} minutes={minutes} url={url} />
      <div className="article-layout">
        <article className="story-content">
          <LegacyBody blocks={j.body} />
        </article>
        <LegacySidebar j={j} related={related} url={url} />
      </div>
    </div>
  );
}
