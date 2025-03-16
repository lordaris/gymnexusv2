import csrf from "csurf";
import cookieParser from "cookie-parser";

// CSRF protection middleware
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

// Cookie parser middleware
export const parseCookies = cookieParser();
