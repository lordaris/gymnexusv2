import React from "react";

export const PageHeader = ({
  title,
  subtitle,
  action,
  breadcrumbs = [],
  className = "",
  centered = false,
  divider = true,
  size = "default", // "small", "default", "large"
}) => {
  // Size-based classes
  const titleSizeClasses = {
    small: "text-2xl font-lato font-semibold",
    default: "text-3xl md:text-4xl font-lato font-semibold",
    large: "text-4xl md:text-5xl font-lato font-bold",
  };

  const subtitleSizeClasses = {
    small: "text-sm mt-1 text-base-content/70",
    default: "text-lg mt-2 text-base-content/70",
    large: "text-xl mt-2 text-base-content/70",
  };

  const alignmentClass = centered
    ? "text-center items-center"
    : "text-left items-start";

  return (
    <div className={`py-6 px-4 sm:px-0 mb-6 ${className}`}>
      {breadcrumbs.length > 0 && (
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            {breadcrumbs.map((crumb, index) => (
              <li key={index}>
                {crumb.href ? (
                  <a href={crumb.href} className="text-primary hover:underline">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-base-content/70">{crumb.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`flex justify-between ${alignmentClass}`}>
        <div className={centered ? "text-center" : ""}>
          <h1 className={titleSizeClasses[size] || titleSizeClasses.default}>
            {title}
          </h1>

          {subtitle && (
            <p
              className={
                subtitleSizeClasses[size] || subtitleSizeClasses.default
              }
            >
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="ml-4">{action}</div>}
      </div>

      {divider && <div className="divider mt-4 mb-0"></div>}
    </div>
  );
};

export default PageHeader;
