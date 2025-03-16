/**
 * Parse cookies from request
 * @param {Object} req - Next.js request object
 * @returns {Object} - Parsed cookies
 */
export function parseCookies(req) {
  const cookies = {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value);
    });
  }

  return cookies;
}

/**
 * Middleware for cookie handling
 * @param {Function} handler - API route handler
 * @returns {Function} - Handler with cookie parsing
 */
export function withCookies(handler) {
  return (req, res) => {
    // Parse cookies and attach to request
    req.cookies = parseCookies(req);

    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Set a cookie in the response
 * @param {Object} res - Next.js response object
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 */
export function setCookie(res, name, value, options = {}) {
  const {
    httpOnly = true,
    secure = process.env.NODE_ENV === "production",
    maxAge = 7 * 24 * 60 * 60 * 1000, // 1 week
    path = "/",
    sameSite = "strict",
  } = options;

  const cookieValue = encodeURIComponent(value);
  let cookie = `${name}=${cookieValue}; Path=${path}; SameSite=${sameSite}`;

  if (httpOnly) cookie += "; HttpOnly";
  if (secure) cookie += "; Secure";
  if (maxAge) {
    const maxAgeSeconds = Math.floor(maxAge / 1000);
    cookie += `; Max-Age=${maxAgeSeconds}`;
  }

  // Append to existing cookies instead of overwriting
  const existingCookies = res.getHeader("Set-Cookie") || [];
  const cookies = Array.isArray(existingCookies)
    ? [...existingCookies, cookie]
    : [existingCookies, cookie];

  res.setHeader("Set-Cookie", cookies);
}
