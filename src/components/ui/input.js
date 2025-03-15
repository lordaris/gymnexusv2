export const Input = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  autoComplete,
  id,
  label,
}) => {
  return (
    <div className="form-control w-full max-w-xs mx-auto">
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text font-lato">{label}</span>
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={`input input-bordered w-full ${className}`}
      />
    </div>
  );
};
