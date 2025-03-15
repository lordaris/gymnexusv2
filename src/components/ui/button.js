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
}) => {
  // Base classes
  let baseClasses = "btn font-lato transition-colors duration-200 ease-in-out";

  // Variant classes
  const variantClasses = {
    primary: "btn-primary hover:btn-primary-focus",
    secondary: "btn-secondary hover:btn-secondary-focus",
    success: "btn-success hover:bg-emerald-600",
    error: "btn-error hover:bg-red-600",
    ghost: "btn-ghost hover:bg-gray-200",
  };

  // Size classes
  const sizeClasses = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };

  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  // Combined classes
  const combinedClasses = `${baseClasses} ${
    variantClasses[variant] || variantClasses.primary
  } ${sizeClasses[size] || sizeClasses.md} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
};
