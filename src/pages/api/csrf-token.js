import { parseCookies, csrfProtection } from "../../utils/csrf";

export default function csrfToken(req, res) {
  parseCookies(req, res, () => {
    csrfProtection(req, res, () => {
      res.json({ csrfToken: req.csrfToken() });
    });
  });
}
