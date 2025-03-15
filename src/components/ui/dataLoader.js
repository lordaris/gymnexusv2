import React from "react";

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]} ${className}`}
    ></div>
  );
};

export const EmptyState = ({
  title = "No data found",
  message = "There are no items to display.",
  actionButton = null,
  icon = null,
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-xl font-lato mb-4">{title}</h3>
      <p className="text-base-content/70 mb-6">{message}</p>
      {actionButton}
    </div>
  );
};

export const ErrorDisplay = ({ error, onRetry = null, className = "" }) => {
  return (
    <div className={`alert alert-error shadow-lg ${className}`}>
      <div className="flex justify-between w-full items-center">
        <span>{error}</span>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-sm btn-outline">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export const DataLoader = ({
  isLoading,
  error,
  isEmpty,
  onRetry,
  children,
  emptyStateProps = {},
  loadingSpinnerProps = {},
  errorDisplayProps = {},
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <LoadingSpinner {...loadingSpinnerProps} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay error={error} onRetry={onRetry} {...errorDisplayProps} />
    );
  }

  if (isEmpty) {
    return <EmptyState {...emptyStateProps} />;
  }

  return children;
};

export default DataLoader;
