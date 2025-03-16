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
  helperText,
  disabled = false,
  min,
  max,
  step,
  icon,
  readOnly = false,
  fullWidth = true,
  size = "md",
}) => {
  const showError = error && touched;
  const widthClass = fullWidth ? "w-full" : "";

  // Size classes
  const sizeClasses = {
    sm: "input-sm text-sm",
    md: "input-md",
    lg: "input-lg text-lg",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`form-control ${widthClass}`}>
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text font-lato">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/60">
            {icon}
          </div>
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
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          className={`input input-bordered ${sizeClass} ${widthClass} ${
            showError ? "input-error" : ""
          } ${icon ? "pl-10" : ""} ${className}`}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={
            (showError ? `${id}-error` : "") ||
            (helperText ? `${id}-helper` : "")
          }
        />
      </div>

      {showError && (
        <div className="label">
          <span id={`${id}-error`} className="label-text-alt text-error">
            {error}
          </span>
        </div>
      )}

      {helperText && !showError && (
        <div className="label">
          <span
            id={`${id}-helper`}
            className="label-text-alt text-base-content/60"
          >
            {helperText}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
