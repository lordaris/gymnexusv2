export const Card = ({
  title,
  children,
  className = "",
  titleClassName = "",
  actionButton = null,
}) => {
  return (
    <div
      className={`card bg-base-200 shadow-md rounded-lg overflow-hidden ${className}`}
    >
      {title && (
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className={`card-title font-lato text-xl ${titleClassName}`}>
            {title}
          </h3>
          {actionButton}
        </div>
      )}
      <div className="card-body p-5">{children}</div>
    </div>
  );
};
