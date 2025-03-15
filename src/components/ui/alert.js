export const Alert = ({ type = "info", message, onClose, className = "" }) => {
  const alertClasses = {
    info: "alert alert-info",
    success: "alert alert-success",
    warning: "alert alert-warning",
    error: "alert alert-error",
  };

  return (
    <div className={`${alertClasses[type]} shadow-lg ${className}`}>
      <div>
        <span>{message}</span>
      </div>
      {onClose && (
        <div className="flex-none">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            X
          </button>
        </div>
      )}
    </div>
  );
};
