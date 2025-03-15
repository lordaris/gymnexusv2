// src/utils/validation.js

// User validation schemas
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character";
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value) return `${fieldName} is required`;
  return "";
};

export const validateNumber = (value, fieldName) => {
  if (value === "") return "";
  if (isNaN(value)) return `${fieldName} must be a number`;
  if (value < 0) return `${fieldName} cannot be negative`;
  return "";
};

// Form validation functions
export const validateLoginForm = (values) => {
  const errors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignupForm = (values) => {
  const errors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (!values.role) errors.role = "Role is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateMetricsForm = (values) => {
  const errors = {};

  // Check numeric fields
  const numericFields = [
    "weight",
    "height",
    "neck",
    "chest",
    "waist",
    "hips",
    "thighs",
    "biceps",
    "benchPressRm",
    "sitUpRm",
    "deadLiftRm",
  ];

  numericFields.forEach((field) => {
    if (values[field]) {
      const error = validateNumber(values[field], field);
      if (error) errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateWorkoutForm = (values) => {
  const errors = {};

  if (!values.name) errors.name = "Workout name is required";

  // Validate days
  if (!values.days || values.days.length === 0) {
    errors.days = "At least one day is required";
  } else {
    const dayErrors = [];
    values.days.forEach((day, dayIndex) => {
      const dayError = {};

      if (!day.day) dayError.day = "Day name is required";
      if (!day.focus) dayError.focus = "Focus is required";

      // Validate exercises
      if (!day.exercises || day.exercises.length === 0) {
        dayError.exercises = "At least one exercise is required";
      } else {
        const exerciseErrors = [];
        day.exercises.forEach((exercise, exerciseIndex) => {
          const exerciseError = {};

          if (!exercise.name) exerciseError.name = "Exercise name is required";
          if (!exercise.sets) exerciseError.sets = "Sets are required";
          if (!exercise.reps) exerciseError.reps = "Reps are required";

          if (Object.keys(exerciseError).length > 0) {
            exerciseErrors[exerciseIndex] = exerciseError;
          }
        });

        if (exerciseErrors.length > 0) {
          dayError.exercises = exerciseErrors;
        }
      }

      if (Object.keys(dayError).length > 0) {
        dayErrors[dayIndex] = dayError;
      }
    });

    if (dayErrors.length > 0) {
      errors.days = dayErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
