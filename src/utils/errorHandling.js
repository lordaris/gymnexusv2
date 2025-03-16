import { toast } from "react-toastify";

/**
 * Global error handler to standardize error handling across the application
 * @param {Error} error - The error object
 * @param {Object} options - Additional options for error handling
 * @param {string} options.context - Where the error occurred
 * @param {string} options.defaultMessage - Default message if no error message is available
 * @param {boolean} options.showToast - Whether to show a toast notification
 * @param {Function} options.callback - Callback function to run after handling the error
 */
export const handleError = (error, options = {}) => {
  const {
    context = "operation",
    defaultMessage = "An unexpected error occurred",
    showToast = true,
    callback = null,
  } = options;

  // Get appropriate error message
  let errorMessage = defaultMessage;

  if (error.response) {
    // Server responded with error
    errorMessage =
      error.response.data?.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = "No response from server. Please check your connection.";
  } else if (error.message) {
    // Error in setting up the request
    errorMessage = error.message;
  }

  // Log error with context for debugging
  console.error(`Error in ${context}:`, error);

  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }

  // Run callback if provided
  if (callback && typeof callback === "function") {
    callback(errorMessage, error);
  }

  return errorMessage;
};

/**
 * Form validation error handler
 * @param {Object} errors - Object containing validation errors
 * @returns {string} - First error message found
 */
export const getFirstValidationError = (errors) => {
  if (!errors || typeof errors !== "object") return null;

  // Get first error message
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    return errors[firstErrorField];
  }

  return null;
};

/**
 * Extracts and formats server-side validation errors
 * @param {Error} error - Axios error object
 * @returns {Object|null} - Formatted errors object or null if no validation errors
 */
export const extractValidationErrors = (error) => {
  if (!error.response || !error.response.data) return null;

  const { data } = error.response;

  // Common validation error formats
  if (data.errors && typeof data.errors === "object") {
    return data.errors;
  }

  if (data.validationErrors && typeof data.validationErrors === "object") {
    return data.validationErrors;
  }

  if (data.message && typeof data.message === "string") {
    return { general: data.message };
  }

  return null;
};
