import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoutButton from "./logoutButton";
import Head from "next/head";

const CoachLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Security check
    const role = Cookies.get("role");
    if (!role) {
      router.push("/");
    } else if (role !== "COACH") {
      router.push("/user/dashboard");
    }
  }, [router]);

  const navItems = [
    {
      label: "Workouts",
      dropdown: true,
      items: [
        { label: "List", href: "/coach/dashboard/workouts" },
        { label: "Create", href: "/coach/dashboard/workouts/new/workout" },
      ],
    },
    {
      label: "Clients",
      dropdown: true,
      items: [
        { label: "List", href: "/coach/dashboard/users" },
        { label: "Create", href: "/coach/dashboard/users/createuser" },
      ],
    },
    {
      label: "Profile",
      href: "/coach/dashboard/profile",
    },
  ];

  return (
    <>
      <Head>
        <title>gymNEXUS - Coach Dashboard</title>
      </Head>
      <div className="drawer">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col min-h-screen">
          {/* Navbar */}
          <header className="w-full navbar bg-base-300 shadow-md z-10">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="drawer-toggle"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>

            <div className="flex-1">
              <Link
                href="/coach/dashboard"
                className="text-xl md:text-3xl lg:text-4xl px-4 md:px-6"
              >
                <span className="font-thin font-lato">gym</span>
                <span className="font-bebas text-primary">NEXUS</span>
              </Link>
            </div>

            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal px-2 gap-1">
                {navItems.map((item, index) =>
                  item.dropdown ? (
                    <li
                      key={index}
                      className="dropdown dropdown-end"
                      tabIndex={0}
                    >
                      <button className="btn btn-ghost m-1">
                        {item.label}
                        <svg
                          className="fill-current h-4 w-4 ml-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className="btn btn-ghost btn-sm justify-start"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={index}>
                      <Link href={item.href} className="btn btn-ghost m-1">
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
                <li>
                  <LogoutButton />
                </li>
              </ul>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-grow">{children}</main>
        </div>

        {/* Drawer/sidebar for mobile */}
        <div className="drawer-side">
          <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
            <li className="mb-6">
              <Link href="/coach/dashboard" className="text-2xl">
                <span className="font-thin font-lato">gym</span>
                <span className="font-bebas text-primary">NEXUS</span>
              </Link>
            </li>

            {navItems.map((item, index) =>
              item.dropdown ? (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{item.label}</span>
                  <ul className="pl-4">
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link href={subItem.href} className="py-2">
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={index} className="mb-2">
                  <Link href={item.href} className="py-2">
                    {item.label}
                  </Link>
                </li>
              )
            )}
            <li className="mt-6">
              <LogoutButton variant="error" size="md" />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CoachLayout;
