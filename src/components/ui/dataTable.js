import React from "react";

export const DataTable = ({
  headers = [],
  data = [],
  keyField = "id",
  renderRow,
  emptyMessage = "No data available",
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg bg-base-200">
        <table className="table w-full">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="bg-base-300">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, colIndex) => (
                  <td key={colIndex} className="animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full overflow-hidden rounded-lg bg-base-200 p-8 text-center">
        <p className="text-base-content/70">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-x-auto rounded-lg bg-base-200 ${className}`}
    >
      <table className="table w-full">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`bg-base-300 ${header.className || ""}`}
                style={header.style || {}}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) =>
            renderRow ? (
              renderRow(item, index)
            ) : (
              <tr key={item[keyField] || index}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>
                    {header.accessor
                      ? typeof header.accessor === "function"
                        ? header.accessor(item)
                        : item[header.accessor]
                      : null}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
