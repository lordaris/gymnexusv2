/**
 * Utility to apply security headers to API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - The handler wrapped with security headers
 */
export function withSecurityHeaders(handler) {
  return async function securityMiddleware(req, res) {
    // Set security headers
    res.setHeader("X-DNS-Prefetch-Control", "on");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );

    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Utility to apply CSRF protection to API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - The handler wrapped with CSRF protection
 */
export function withCsrfProtection(handler) {
  return async function csrfMiddleware(req, res) {
    // Skip CSRF check for GET requests and login/signup routes
    if (
      req.method === "GET" ||
      req.url.startsWith("/api/users/login") ||
      req.url.startsWith("/api/users/signup") ||
      req.url.startsWith("/api/csrf-token")
    ) {
      return handler(req, res);
    }

    // Check CSRF token
    const csrfToken = req.headers["x-csrf-token"] || req.body._csrf;

    if (!csrfToken || !req.session || csrfToken !== req.session.csrfToken) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }

    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Combine multiple middleware functions
 * @param  {...Function} middlewares - Middleware functions to combine
 * @returns {Function} - Combined middleware
 */
export function combineMiddleware(...middlewares) {
  return function (handler) {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}

/**
 * Apply both security headers and CSRF protection
 * @param {Function} handler - The API route handler
 * @returns {Function} - The handler with security headers and CSRF protection
 */
export const withApiSecurity = combineMiddleware(
  withSecurityHeaders,
  withCsrfProtection
);
