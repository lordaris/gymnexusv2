import { parseCookies, csrfProtection } from "../../utils/csrf";
import { apiLimiter } from "../../utils/rateLimit";
import securityHeadersMiddleware from "../../middleware/securityHeaders";

export default function middleware(req, res, next) {
  return securityHeadersMiddleware(req, res, () => {
    return apiLimiter(req, res, () => {
      // Skip CSRF for certain routes that don't need it
      if (
        req.url.startsWith("/api/users/login") ||
        req.url.startsWith("/api/users/signup") ||
        req.url.startsWith("/api/users/refresh-token")
      ) {
        return next();
      }

      // Apply cookie parser and CSRF protection
      return parseCookies(req, res, () => {
        return csrfProtection(req, res, next);
      });
    });
  });
}
