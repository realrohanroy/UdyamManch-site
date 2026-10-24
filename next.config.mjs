/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
