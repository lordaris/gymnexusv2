export const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-lato font-semibold">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-base-content/70">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
