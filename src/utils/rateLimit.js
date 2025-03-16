// A simple in-memory store for rate limiting
const stores = {
  api: new Map(),
  auth: new Map(),
};

// Clean up old entries periodically
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Clean up function to prevent memory leaks
function setupCleanup() {
  if (typeof window === "undefined") {
    // Only run on server
    setInterval(() => {
      const now = Date.now();

      // Clean up API store
      for (const [key, value] of stores.api.entries()) {
        if (value.resetTime < now) {
          stores.api.delete(key);
        }
      }

      // Clean up Auth store
      for (const [key, value] of stores.auth.entries()) {
        if (value.resetTime < now) {
          stores.auth.delete(key);
        }
      }
    }, CLEANUP_INTERVAL);
  }
}

// Set up the cleanup interval
setupCleanup();

/**
 * Rate limit middleware for API routes
 * @param {Function} handler - The API route handler
 * @param {Object} options - Rate limit options
 * @returns {Function} - Handler with rate limiting
 */
export function withRateLimit(
  handler,
  { limit = 100, windowMs = 15 * 60 * 1000, storeType = "api" } = {}
) {
  return async function rateMiddleware(req, res) {
    const store = stores[storeType];
    if (!store) {
      console.error(`Invalid store type: ${storeType}`);
      return handler(req, res);
    }

    // Create a token based on IP or other identifier
    // For production, you might want to use a more sophisticated approach
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      "unknown";

    const token = `${ip}-${req.url}`;
    const now = Date.now();

    // Get current rate limit data or create new entry
    let rateData = store.get(token);

    if (!rateData) {
      rateData = {
        count: 0,
        resetTime: now + windowMs,
      };
      store.set(token, rateData);
    }

    // If reset time has passed, reset the counter
    if (rateData.resetTime < now) {
      rateData.count = 0;
      rateData.resetTime = now + windowMs;
    }

    // Increment request count
    rateData.count += 1;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - rateData.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(rateData.resetTime / 1000));

    // Check if rate limit exceeded
    if (rateData.count > limit) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
        retryAfter: Math.ceil((rateData.resetTime - now) / 1000),
      });
    }

    // Proceed to the handler if not rate limited
    return handler(req, res);
  };
}

/**
 * Rate limit middleware specifically for authentication routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - Handler with stricter rate limiting
 */
export function withAuthRateLimit(handler) {
  return withRateLimit(handler, {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    storeType: "auth",
  });
}
