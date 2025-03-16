import React from "react";

export const Card = ({
  title,
  subtitle,
  children,
  className = "",
  titleClassName = "",
  actionButton = null,
  footer = null,
  isLoading = false,
  noPadding = false,
  centered = false,
}) => {
  const cardBodyClasses = noPadding ? "" : "p-5";
  const contentClasses = centered ? "flex flex-col items-center" : "";

  // Loading placeholder
  if (isLoading) {
    return (
      <div
        className={`card bg-base-200 shadow-md rounded-lg overflow-hidden animate-pulse ${className}`}
      >
        {title && (
          <div className="p-4 border-b border-base-300">
            <div className="h-6 bg-base-300 rounded w-1/3 mb-2"></div>
            {subtitle && <div className="h-4 bg-base-300 rounded w-1/2"></div>}
          </div>
        )}
        <div className={`card-body ${cardBodyClasses}`}>
          <div className="space-y-4">
            <div className="h-4 bg-base-300 rounded"></div>
            <div className="h-4 bg-base-300 rounded w-5/6"></div>
            <div className="h-4 bg-base-300 rounded w-4/6"></div>
          </div>
        </div>
        {footer && (
          <div className="h-12 bg-base-300 border-t border-base-300"></div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`card bg-base-200 shadow-md rounded-lg overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <div>
            {title && (
              <h3 className={`card-title font-lato text-xl ${titleClassName}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-base-content/70 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}
      <div className={`card-body ${cardBodyClasses} ${contentClasses}`}>
        {children}
      </div>
      {footer && (
        <div className="p-4 bg-base-200 border-t border-base-300">{footer}</div>
      )}
    </div>
  );
};

export default Card;
