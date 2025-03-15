export const ListItem = ({
  title,
  onClick,
  actionButton = null,
  className = "",
}) => {
  return (
    <li
      className={`bg-base-200 rounded-lg shadow-md overflow-hidden mb-4 ${className}`}
    >
      <div
        className="flex justify-between items-center p-4 hover:bg-base-300 cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-xl font-lato font-semibold">{title}</h3>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </li>
  );
};
