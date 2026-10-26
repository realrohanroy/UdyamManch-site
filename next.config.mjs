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
  async redirects() {
    return [
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
