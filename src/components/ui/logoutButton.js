import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { FaSignOutAlt } from "react-icons/fa";
import { Button } from "./button";

export default function LogoutButton({
  variant = "ghost",
  size = "md",
  fullWidth = false,
  className = "",
  icon = null,
  showIcon = true,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Clear all cookies
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    Cookies.remove("email");

    // Redirect to home page
    router.push("/");
  };

  const handleLogoutClick = () => {
    setIsConfirmOpen(true);
  };

  const handleCancelLogout = () => {
    setIsConfirmOpen(false);
  };

  // Default icon if not provided
  const logoutIcon = icon || (showIcon ? <FaSignOutAlt /> : null);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogoutClick}
        fullWidth={fullWidth}
        className={`${className} ${
          variant === "ghost"
            ? "text-error hover:bg-error hover:bg-opacity-10"
            : ""
        }`}
        icon={logoutIcon}
        disabled={isLoggingOut || isConfirmOpen}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCancelLogout}
          ></div>

          {/* Dialog */}
          <div className="bg-base-100 rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>

            <div className="flex justify-end space-x-4">
              <Button variant="ghost" onClick={handleCancelLogout} size="sm">
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={handleLogout}
                size="sm"
                isLoading={isLoggingOut}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
