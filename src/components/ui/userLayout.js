import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoutButton from "./logoutButton";

// TODO: Add a logout button
// TODO: Modify the navbar to be more responsive and with a better design
// TODO: Add a logo to the navbar

const UserLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = Cookies.get("role");
  const router = useRouter();

  const SecurityCheck = () => {
    const role = Cookies.get("role");
    const router = useRouter();

    if (!role) {
      router.push("/");
    } else if (role !== "COACH") {
      router.push("/user/dashboard");
    }
  };
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/*Navbar*/}
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
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
                ></path>
              </svg>
            </label>
          </div>
          <Link href={"/user/dashboard"} className="flex-1">
            <h1 className="text-5xl px-10">
              <span className={"font-thin font-lato"}>gym</span>
              <span className="font-bebas text-primary ">NEXUS</span>
            </h1>
          </Link>{" "}
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal px-10 ">
              <li>
                <Link href={"/user/dashboard/routines"}> Workouts </Link>
              </li>
              <li>
                <Link href={"/user/dashboard/profile"}>Profile</Link>
              </li>

              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
        {/*content*/}
        <div className={"text-center"}>
          <main className="">{children}</main>
        </div>{" "}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-2 w-80 bg-base-100">
          {/*Sidebar content*/}
          <li>
            <Link href={"/user/dashboard"}>Dashboard</Link>
          </li>
          <li>
            <Link href={"/user/dashboard/routines"}> Workouts </Link>
          </li>
          <li>
            <Link href={"/user/dashboard/profile"}>Profile</Link>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserLayout;
