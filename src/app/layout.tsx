import type { Metadata } from 'next';
import { Bricolage_Grotesque, Newsreader, Caveat } from 'next/font/google';
import '@/styles/tokens.css';
import '@/styles/editorial.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyBoardDrawer from '@/components/MyBoardDrawer';
import { BoardProvider } from '@/lib/board';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false,
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-script',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://udyammanch.in'),
  title: {
    default: 'Udyam Manch (उद्यम मंच): The Indian Builder Archive',
    template: '%s | Udyam Manch',
  },
  description:
    'An independent editorial magazine and verifiable archive chronicling grassroots commercial resilience, soil-level engineering, and Tier-2 founders across India.',
  keywords: [
    'Indian Founders',
    'Agritech',
    'Grassroots Innovation',
    'Rural Enterprise',
    'Tier 2 Builders',
    'Farming Solutions India',
    'Kishan Panchal',
    'Manufacturing',
  ],
  authors: [{ name: 'Udyam Manch Editorial Desk' }],
  creator: 'Udyam Manch',
  publisher: 'Udyam Manch',
  openGraph: {
    title: 'Udyam Manch (उद्यम मंच): The Indian Builder Archive',
    description:
      'Chronicling grassroots commercial resilience, soil-level engineering, and non-metro founders across India.',
    url: 'https://udyammanch.in',
    siteName: 'Udyam Manch',
    images: [
      {
        url: '/assets/kishan-panchal/double-portrait-yellow-halo.webp',
        width: 1200,
        height: 630,
        alt: 'Udyam Manch Editorial Magazine Cover',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Udyam Manch (उद्यम मंच): The Indian Builder Archive',
    description: 'Documenting real commercial builders across India.',
    creator: '@udyammanch',
    images: ['/assets/kishan-panchal/double-portrait-yellow-halo.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name: 'Udyam Manch',
    alternateName: 'उद्यम मंच',
    url: 'https://udyammanch.in',
    description:
      'Independent editorial magazine chronicling Indian grassroots founders and industrial innovation.',
    publisher: {
      '@type': 'Organization',
      name: 'Udyam Manch',
      url: 'https://udyammanch.in',
    },
  };

  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable} ${caveat.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('um-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="editorial-grain">
        <BoardProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <MyBoardDrawer />
        </BoardProvider>
      </body>
    </html>
  );
}
