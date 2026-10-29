/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // do not advertise the framework
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // blocks lookalike pages framing the site
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Bots and old browsers ask for /favicon.ico without reading the page. Serve the SVG icon (app/icon.svg).
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/icon.svg' }];
  },
  async redirects() {
    return [
      // Addresses from the old static site (before Next.js). Links to them are already shared.
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:path*/index.html', destination: '/:path*', permanent: true },
      // The old site's Kishan images, now on Cloudinary (DEC-025). Old share previews pointed here.
      {
        source: '/assets/kishan-panchal/double-portrait-yellow-halo.:ext(png|webp)',
        destination: 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668702/double-portrait-yellow-halo.webp',
        permanent: true,
      },
      {
        source: '/assets/kishan-panchal/field-business-school.:ext(png|webp)',
        destination: 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668673/field-business-school.webp',
        permanent: true,
      },
      {
        source: '/assets/kishan-panchal/india-network-map.:ext(png|webp)',
        destination: 'https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668717/india-network-map.png',
        permanent: true,
      },
      {
        source: '/founder/:slug',
        destination: '/founders/:slug',
        permanent: true,
      },
      {
        source: '/story/:slug',
        destination: '/stories/:slug',
        permanent: true,
      },
      {
        source: '/stories/the-field-is-the-real-business-school',
        destination: '/founders/kishan-panchal-farming-solutions-india',
        permanent: true,
      },
      {
        source: '/stories/8',
        destination: '/founders/kishan-panchal-farming-solutions-india',
        permanent: true,
      },
      {
        source: '/stories/kishan-panchal-farming-solutions-india',
        destination: '/founders/kishan-panchal-farming-solutions-india',
        permanent: true,
      },
      {
        source: '/stories/kishan-for-kisan',
        destination: '/founders/kishan-panchal-farming-solutions-india',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
