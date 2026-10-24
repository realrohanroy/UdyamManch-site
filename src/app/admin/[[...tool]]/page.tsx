'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function AdminStudioPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', inset: 0, zIndex: 9999 }}>
      <NextStudio config={config} />
    </div>
  );
}
