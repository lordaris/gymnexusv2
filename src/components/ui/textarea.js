export const TextArea = ({
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  id,
  label,
  rows = 3,
}) => {
  return (
    <div className="form-control w-full max-w-xs mx-auto">
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text font-lato">{label}</span>
        </label>
      )}
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`textarea textarea-bordered w-full ${className}`}
        rows={rows}
      />
    </div>
  );
};
