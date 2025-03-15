import React from "react";

export const FormError = ({ error }) => {
  if (!error) return null;

  return (
    <div className="alert alert-error mt-4 mb-4">
      <span>{error}</span>
    </div>
  );
};

export const Form = ({ onSubmit, children, error, className = "" }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error && <FormError error={error} />}
      {children}
    </form>
  );
};

export const FormGroup = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const FormActions = ({ children, className = "" }) => {
  return (
    <div className={`mt-6 flex items-center gap-4 ${className}`}>
      {children}
    </div>
  );
};
