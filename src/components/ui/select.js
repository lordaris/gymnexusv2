export const Select = ({
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = "",
  id,
  label,
  placeholder,
}) => {
  return (
    <div className="form-control w-full max-w-xs mx-auto">
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text font-lato">{label}</span>
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`select select-bordered w-full ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
