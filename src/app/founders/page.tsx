import type { Metadata } from 'next';
import { getJourneys } from '@/lib/journey/repo';
import FoundersDirectory, { type DirectoryItem } from '@/components/FoundersDirectory';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Founders',
  description: 'Founder journeys from across India, researched and edited by the Udyam Manch team.',
  alternates: { canonical: '/founders' },
};

export default async function FoundersPage() {
  const journeys = await getJourneys();
  const items: DirectoryItem[] = journeys.map((j) => ({
    slug: j.slug,
    name: j.founder.name,
    company: j.company.name,
    desc: j.company.summary,
    industry: j.company.industry ?? '',
    city: j.company.city ?? j.founder.location ?? '',
    year: j.company.founded ?? '',
    sample: j.sample,
  }));

  return (
    <div className="w">
      <div className="ph">
        <h1>Founders directory</h1>
        <p>Journeys and interviews, researched and edited by our team.</p>
      </div>
      <FoundersDirectory items={items} />
    </div>
  );
}
