module.exports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: `
    default-src 'self';
    script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline' 'unsafe-eval';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' data: https://*.cloudinary.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.cloudinary.com;
    frame-src 'self';
    object-src 'none'
  `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};
