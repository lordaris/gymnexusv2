import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { PageTitle } from "./pageTitle";
import {
  FaHome,
  FaDumbbell,
  FaUser,
  FaWeight,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LogoutButton from "./logoutButton";

const UserLayout = ({ children, title = "Athlete Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Security check
    const role = Cookies.get("role");
    if (!role) {
      router.push("/");
    } else if (role !== "ATHLETE") {
      router.push("/coach/dashboard");
    }
  }, [router]);

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  const navItems = [
    {
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
      href: "/user/dashboard",
    },
    {
      label: "Workouts",
      icon: <FaDumbbell className="w-5 h-5" />,
      href: "/user/dashboard/routines",
    },
    {
      label: "Metrics",
      icon: <FaWeight className="w-5 h-5" />,
      href: "/user/dashboard/metrics/new",
    },
    {
      label: "Profile",
      icon: <FaUser className="w-5 h-5" />,
      href: "/user/dashboard/profile",
    },
  ];

  // Check if path is active
  const isActive = (path) => {
    if (path === "/user/dashboard") {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  // Logo component
  const Logo = () => (
    <Link href="/user/dashboard" className="flex items-center px-4 py-2">
      <h1 className="text-2xl md:text-3xl">
        <span className="font-thin font-lato">gym</span>
        <span className="font-bebas text-primary">NEXUS</span>
      </h1>
    </Link>
  );

  return (
    <>
      {/* Use PageTitle component instead of Head for title */}
      <PageTitle title={title} />

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex bg-base-100">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-base-200 border-r border-base-300">
          <div className="flex flex-col h-full">
            <div className="py-6 px-4 border-b border-base-300">
              <Logo />
            </div>

            <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
              <ul className="space-y-1 px-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md ${
                        isActive(item.href)
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-300"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-base-300">
              <LogoutButton
                variant="error"
                size="md"
                fullWidth
                icon={<FaSignOutAlt />}
              />
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="lg:hidden bg-base-200 border-b border-base-300 px-4 py-2">
            <div className="flex justify-between items-center">
              <Logo />
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sidebarOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </header>

          {/* Mobile sidebar (overlay) */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 flex">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setSidebarOpen(false)}
              ></div>

              {/* Sidebar */}
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-base-200">
                <div className="flex justify-between items-center px-4 py-2 border-b border-base-300">
                  <Logo />
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
                  <ul className="space-y-1 px-2">
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className={`flex items-center px-3 py-2 rounded-md ${
                            isActive(item.href)
                              ? "bg-primary text-primary-content"
                              : "hover:bg-base-300"
                          }`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-4 border-t border-base-300">
                  <LogoutButton
                    variant="error"
                    size="md"
                    fullWidth
                    icon={<FaSignOutAlt />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-base-100">
            <div className="container mx-auto px-4 py-6">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
