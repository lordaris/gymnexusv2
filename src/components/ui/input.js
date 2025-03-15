import React from "react";

export const Input = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  className = "",
  autoComplete,
  id,
  label,
  error,
  touched,
}) => {
  const showError = error && touched;

  return (
    <div className="form-control w-full max-w-xs mx-auto">
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text font-lato">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        autoComplete={autoComplete}
        className={`input input-bordered w-full ${
          showError ? "input-error" : ""
        } ${className}`}
        aria-invalid={showError ? "true" : "false"}
        aria-describedby={showError ? `${id}-error` : undefined}
      />
      {showError && (
        <div className="label">
          <span id={`${id}-error`} className="label-text-alt text-error">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};
