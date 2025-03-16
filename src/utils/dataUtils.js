import { format, parseISO, isValid } from "date-fns";

/**
 * Safely formats a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The date-fns format string
 * @param {string} fallback - Fallback string if date is invalid
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatStr = "MMM d, yyyy", fallback = "") => {
  if (!date) return fallback;

  try {
    let dateObj;
    if (typeof date === "string") {
      // Try to parse ISO string
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) return fallback;

    return format(dateObj, formatStr);
  } catch (err) {
    console.error("Date formatting error:", err);
    return fallback;
  }
};

/**
 * Calculates Body Mass Index (BMI)
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 * @returns {number|null} - BMI value or null if inputs are invalid
 */
export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;

  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

/**
 * Calculates body fat percentage using U.S. Navy method
 * @param {string} gender - 'MALE' or 'FEMALE'
 * @param {number} neckCm - Neck circumference in cm
 * @param {number} waistCm - Waist circumference in cm
 * @param {number} hipsCm - Hip circumference in cm (for females)
 * @param {number} heightCm - Height in cm
 * @returns {number|null} - Body fat percentage or null if inputs are invalid
 */
export const calculateBodyFatPercentage = (
  gender,
  neckCm,
  waistCm,
  hipsCm,
  heightCm
) => {
  if (!gender || !neckCm || !waistCm || !heightCm) return null;
  if (gender === "FEMALE" && !hipsCm) return null;

  try {
    if (gender === "MALE") {
      const result =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistCm - neckCm) +
            0.15456 * Math.log10(heightCm)) -
        450;
      return parseFloat(result.toFixed(1));
    } else if (gender === "FEMALE") {
      const result =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waistCm + hipsCm - neckCm) +
            0.221 * Math.log10(heightCm)) -
        450;
      return parseFloat(result.toFixed(1));
    }
    return null;
  } catch (err) {
    console.error("Body fat calculation error:", err);
    return null;
  }
};

/**
 * Get BMI category based on BMI value
 * @param {number} bmi - Body Mass Index value
 * @returns {string} - BMI category
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return "Unknown";

  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 25) return "Normal";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  if (bmi >= 30) return "Obese";

  return "Unknown";
};

/**
 * Get body fat category based on percentage and gender
 * @param {number} percentage - Body fat percentage
 * @param {string} gender - 'MALE' or 'FEMALE'
 * @returns {string} - Body fat category
 */
export const getBodyFatCategory = (percentage, gender) => {
  if (!percentage || !gender) return "Unknown";

  if (gender === "MALE") {
    if (percentage < 6) return "Essential Fat";
    if (percentage >= 6 && percentage < 14) return "Athletic";
    if (percentage >= 14 && percentage < 18) return "Fitness";
    if (percentage >= 18 && percentage < 25) return "Average";
    if (percentage >= 25) return "Obese";
  } else if (gender === "FEMALE") {
    if (percentage < 13) return "Essential Fat";
    if (percentage >= 13 && percentage < 21) return "Athletic";
    if (percentage >= 21 && percentage < 25) return "Fitness";
    if (percentage >= 25 && percentage < 32) return "Average";
    if (percentage >= 32) return "Obese";
  }

  return "Unknown";
};

/**
 * Calculate one-rep max using Brzycki formula
 * @param {number} weight - Weight lifted in kg
 * @param {number} reps - Number of reps performed
 * @returns {number|null} - Estimated one-rep max
 */
export const calculateOneRepMax = (weight, reps) => {
  if (!weight || !reps || weight <= 0 || reps <= 0) return null;

  const oneRepMax = weight * (36 / (37 - reps));
  return parseFloat(oneRepMax.toFixed(1));
};

/**
 * Sort array of objects by date field
 * @param {Array} array - Array of objects to sort
 * @param {string} dateField - Name of the date field
 * @param {boolean} ascending - Sort direction
 * @returns {Array} - Sorted array
 */
export const sortByDate = (array, dateField = "date", ascending = true) => {
  if (!array || !array.length) return [];

  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);

    return ascending
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

/**
 * Calculates the difference between two metric values and returns it with a sign
 * @param {number} currentValue - Current metric value
 * @param {number} previousValue - Previous metric value
 * @returns {string|null} - Formatted difference with sign (e.g., "+1.5" or "-2.0")
 */
export const calculateMetricChange = (currentValue, previousValue) => {
  if (
    currentValue === null ||
    previousValue === null ||
    currentValue === undefined ||
    previousValue === undefined
  ) {
    return null;
  }

  const difference = currentValue - previousValue;
  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference.toFixed(1)}`;
};

/**
 * Get progress status based on change between current and previous value
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @param {boolean} higherIsBetter - Whether higher values represent improvement
 * @returns {string} - 'improved', 'declined', or 'unchanged'
 */
export const getProgressStatus = (current, previous, higherIsBetter = true) => {
  if (
    current === null ||
    previous === null ||
    current === undefined ||
    previous === undefined
  ) {
    return "unchanged";
  }

  const diff = current - previous;

  if (diff === 0) return "unchanged";

  if (higherIsBetter) {
    return diff > 0 ? "improved" : "declined";
  } else {
    return diff < 0 ? "improved" : "declined";
  }
};

/**
 * Get the most recent metrics entry from an array of metrics
 * @param {Array} metrics - Array of metrics objects
 * @returns {Object|null} - Most recent metrics entry or null
 */
export const getMostRecentMetrics = (metrics) => {
  if (!metrics || !metrics.length) return null;

  const sorted = sortByDate(metrics, "date", false); // Sort descending
  return sorted[0];
};

/**
 * Safely access nested object properties
 * @param {Object} obj - The object to access
 * @param {string} path - Path to the property, e.g. "user.profile.name"
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} - Property value or default value
 */
export const get = (obj, path, defaultValue = null) => {
  if (!obj || !path) return defaultValue;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (
      result === null ||
      result === undefined ||
      !Object.prototype.hasOwnProperty.call(result, key)
    ) {
      return defaultValue;
    }
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
};
