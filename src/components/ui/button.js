import React from "react";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  fullWidth = false,
  icon = null,
  iconPosition = "left",
  isLoading = false,
}) => {
  // Base classes
  const baseClasses =
    "btn font-lato transition-colors duration-200 ease-in-out flex items-center justify-center";

  // Variant classes with improved hover and focus states
  const variantClasses = {
    primary:
      "btn-primary hover:btn-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
    secondary:
      "btn-secondary hover:btn-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50",
    success:
      "btn-success hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50",
    error:
      "btn-error hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-error focus:ring-opacity-50",
    ghost:
      "btn-ghost hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-base-300 focus:ring-opacity-50",
    link: "btn-link hover:underline focus:outline-none",
    outline:
      "btn-outline border-2 hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-base-300 focus:ring-opacity-50",
  };

  // Size classes with more consistent spacing
  const sizeClasses = {
    xs: "btn-xs px-2 py-1 text-xs",
    sm: "btn-sm px-3 py-1 text-sm",
    md: "btn-md px-4 py-2",
    lg: "btn-lg px-6 py-2 text-lg",
    xl: "px-8 py-3 text-xl",
  };

  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  // Disabled class with improved visual indication
  const disabledClass =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  // Combined classes
  const combinedClasses = `${baseClasses} ${
    variantClasses[variant] || variantClasses.primary
  } ${
    sizeClasses[size] || sizeClasses.md
  } ${widthClass} ${disabledClass} ${className}`;

  // Loading spinner
  const loadingSpinner = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClasses}
      aria-busy={isLoading}
    >
      {isLoading && loadingSpinner}
      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
