import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Button } from "./button";

export default function LogoutButton({ variant = "ghost", size = "md" }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    router.push("/");
  };

  const handleLogoutConfirmation = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogoutConfirmation}
      className="text-error hover:bg-error hover:bg-opacity-10"
    >
      Logout
    </Button>
  );
}
