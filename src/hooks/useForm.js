// src/hooks/useForm.js
import { useState } from "react";

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // Auto-clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    setTouched({ ...touched, [name]: true });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (field, value) => {
    setValues({ ...values, [field]: value });
  };

  const setFieldError = (field, error) => {
    setErrors({ ...errors, [field]: error });
  };

  const validate = (validationFn) => {
    try {
      const { isValid, errors: validationErrors } = validationFn(values);
      setErrors(validationErrors || {});
      return isValid;
    } catch (err) {
      console.error("Validation error:", err);
      setErrors({ form: err.message || "Validation failed" });
      return false;
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    setFieldValue,
    setFieldError,
    validate,
    setValues,
    setErrors,
    setTouched,
  };
}
