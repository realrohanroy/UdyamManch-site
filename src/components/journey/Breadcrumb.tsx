import { Fragment } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/" aria-label="Home">
        <Home size={14} strokeWidth={2} aria-hidden="true" className="fj-crumb-home" />
      </Link>
      {items.map((c) => (
        <Fragment key={c.label}>
          <span className="sep" aria-hidden="true">›</span>
          {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
