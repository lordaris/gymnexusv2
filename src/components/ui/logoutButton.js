import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token from cookie
    Cookies.remove("role"); // Remove role from cookie
    Cookies.remove("user"); // Remove user from cookie
    router.push("/"); // Redirect to home page
  };

  const handleLogoutConfirmation = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  return (
    <>
      <a
        href="#logout"
        className="text-error"
        onClick={handleLogoutConfirmation}
      >
        Logout{" "}
      </a>
    </>
  );
}
