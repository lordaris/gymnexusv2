// src/components/ui/mobileNav.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaHome,
  FaDumbbell,
  FaUsers,
  FaUser,
  FaWeight,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

export const MobileNav = () => {
  const { isCoach, logout } = useAuth();
  const router = useRouter();

  // Determine which items to show based on user role
  const navItems = isCoach()
    ? [
        { icon: FaHome, label: "Home", href: "/coach/dashboard" },
        {
          icon: FaDumbbell,
          label: "Workouts",
          href: "/coach/dashboard/workouts",
        },
        { icon: FaUsers, label: "Clients", href: "/coach/dashboard/users" },
        {
          icon: FaWeight,
          label: "Metrics",
          href: "/coach/dashboard/metrics/new",
        },
        { icon: FaUser, label: "Profile", href: "/coach/dashboard/profile" },
      ]
    : [
        { icon: FaHome, label: "Home", href: "/user/dashboard" },
        {
          icon: FaDumbbell,
          label: "Workouts",
          href: "/user/dashboard/routines",
        },
        {
          icon: FaWeight,
          label: "Metrics",
          href: "/user/dashboard/metrics/new",
        },
        { icon: FaUser, label: "Profile", href: "/user/dashboard/profile" },
      ];

  // Check if current path matches nav item
  const isActive = (href) => {
    if (href === "/coach/dashboard" || href === "/user/dashboard") {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom navigation for mobile only */}
      <nav className="bottom-nav shadow-lg">
        {navItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <div
              className={`bottom-nav-item ${
                isActive(item.href) ? "text-primary" : ""
              }`}
            >
              <item.icon className="bottom-nav-icon" />
              <span className="bottom-nav-label">{item.label}</span>
            </div>
          </Link>
        ))}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              logout();
            }
          }}
          className="bottom-nav-item text-error"
        >
          <FaSignOutAlt className="bottom-nav-icon" />
          <span className="bottom-nav-label">Logout</span>
        </button>
      </nav>

      {/* Add padding at the bottom of the layout to account for the nav */}
      <div className="h-16 lg:hidden"></div>
    </>
  );
};

// src/components/ui/responsiveLayout.js
import React from "react";
import Head from "next/head";
import { MobileNav } from "./mobileNav";
import { useAuth } from "../../contexts/AuthContext";

export const ResponsiveLayout = ({
  children,
  title = "gymNEXUS",
  showMobileNav = true,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>

      {isAuthenticated() && showMobileNav && <MobileNav />}
    </>
  );
};

export default ResponsiveLayout;
