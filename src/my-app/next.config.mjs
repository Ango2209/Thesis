import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  swcMinify: true,            // Enable SWC minification for improved performance
  compiler: {
      removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
  }
};

export default withPWA({
  dest: "public",         // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
  register: true,         // register the PWA service worker
  skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);


// export default nextConfig;
