import React from "react";

export const FormContainer = ({
  children,
  title,
  subtitle,
  maxWidth = "max-w-2xl",
  className = "",
}) => {
  return (
    <div className={`w-full ${maxWidth} mx-auto px-4 py-6 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h1 className="text-3xl md:text-4xl font-lato font-semibold mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-base-content/70">{subtitle}</p>
          )}
        </div>
      )}

      <div className="bg-base-200 rounded-lg shadow-md p-6">{children}</div>
    </div>
  );
};

export default FormContainer;
