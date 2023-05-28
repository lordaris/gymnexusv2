import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoutButton from "./logoutButton";
import Head from "next/head";

// TODO: Modify the navbar to be more responsive and with a better design
// TODO: Add a logo to the navbar

const CoachLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <>
      <Head>
        <title>gymNEXUS - Coach Dashboard</title>
      </Head>
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
            <Link href={"/coach/dashboard"} className="flex-1">
              <h1 className="text-5xl px-10">
                <span className={"font-thin font-lato"}>gym</span>
                <span className="font-bebas text-primary ">NEXUS</span>
              </h1>
            </Link>{" "}
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal px-10 ">
                <li tabIndex={0}>
                  <p className={""}>
                    Workouts
                    <svg
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </p>
                  <ul className="p-2 bg-base-200">
                    <li>
                      <Link href={"/coach/dashboard/workouts"}>List</Link>
                    </li>
                    <li>
                      <Link href={"/coach/dashboard/workouts/new/workout"}>
                        Create
                      </Link>
                    </li>
                  </ul>
                </li>

                <li tabIndex={0}>
                  <p>
                    Clients
                    <svg
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </p>
                  <ul className="p-2 bg-base-200">
                    <li>
                      <Link href={"/coach/dashboard/users"}>List</Link>
                    </li>
                    <li>
                      <Link href={"/coach/dashboard/users/createuser"}>
                        Create
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href={"/coach/dashboard/profile"}>Profile</Link>
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
              <div className="dropdown dropdown-bottom">
                <label tabIndex={0} className=" m-1">
                  Workouts
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href={"/coach/dashboard/workouts"}>List</Link>
                  </li>
                  <li>
                    <Link href={"/coach/dashboard/workouts/new/workout"}>
                      Create
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div className="dropdown dropdown-bottom">
                <label tabIndex={0} className=" m-1">
                  Clients
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href={"/coach/dashboard/users"}>List</Link>
                  </li>
                  <li>
                    <Link href={"/coach/dashboard/users/createuser"}>
                      Create
                    </Link>
                  </li>
                </ul>
              </div>{" "}
            </li>
            <li>
              <Link href={"/coach/dashboard/profile"}>Profile</Link>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CoachLayout;
