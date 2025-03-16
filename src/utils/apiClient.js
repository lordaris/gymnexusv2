import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Default request timeout
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle offline/network errors
    if (!response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Handle authentication errors
    if (response.status === 401) {
      toast.error("Your session has expired. Please log in again.");

      // Clear cookies
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("user");
      Cookies.remove("email");

      // Only redirect in browser environment and if not already on login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Handle server errors
    if (response.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    // Handle validation errors
    if (
      response.status === 422 ||
      (response.status === 400 && response.data?.validationErrors)
    ) {
      const validationMessage = response.data?.message || "Validation failed";
      toast.error(validationMessage);
    }

    return Promise.reject(error);
  }
);

// API service factory
const createApiService = (basePath) => {
  return {
    getAll: (params = {}) => apiClient.get(basePath, { params }),
    getById: (id, params = {}) =>
      apiClient.get(`${basePath}/${id}`, { params }),
    create: (data) => apiClient.post(basePath, data),
    update: (id, data) => apiClient.put(`${basePath}/${id}`, data),
    delete: (id) => apiClient.delete(`${basePath}/${id}`),
    request: (config) => apiClient(config),
  };
};

// API endpoints - Authentication
export const authAPI = {
  login: (credentials) => apiClient.post("/users/login", credentials),
  signup: (userData) => apiClient.post("/users/signup", userData),
  validateToken: () => apiClient.get("/users/validate-token"),
  refreshToken: (refreshToken) =>
    apiClient.post("/users/refresh-token", refreshToken),
};

// API endpoints - Users
export const usersAPI = {
  ...createApiService("/users"),
  getByCoach: (coachId) => apiClient.get(`/users/by-coach/${coachId}`),
  getById: (id) => apiClient.get(`/users/by-user-id/${id}`),
  update: (id, userData) => apiClient.put(`/users/profile/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/profile/${id}`),
  addMetrics: (userId, metricsData) =>
    apiClient.post(`/users/profile/metrics/${userId}`, metricsData),
  deleteMetrics: (userId, metricsId) =>
    apiClient.delete(`/users/profile/metrics/${userId}/${metricsId}`),
};

// API endpoints - Workouts
export const workoutsAPI = {
  ...createApiService("/workouts/list"),
  getByCoach: (coachId) => apiClient.get(`/workouts/list/coach/${coachId}`),
  getById: (id) => apiClient.get(`/workouts/list/by-id/${id}`),
  getAssigned: (userId) => apiClient.get(`/workouts/list/assigned/${userId}`),
  create: (workoutData) => apiClient.post("/workouts/create", workoutData),
  addDay: (workoutId, dayData) =>
    apiClient.post(`/workouts/create/${workoutId}`, dayData),
  addExercise: (workoutId, dayId, exerciseData) =>
    apiClient.post(`/workouts/create/${workoutId}/${dayId}`, exerciseData),
  updateExercise: (workoutId, dayId, exerciseId, exerciseData) =>
    apiClient.put(
      `/workouts/update/${workoutId}/${dayId}/${exerciseId}`,
      exerciseData
    ),
  delete: (workoutId) => apiClient.delete(`/workouts/delete/${workoutId}`),
  deleteDay: (workoutId, dayId) =>
    apiClient.delete(`/workouts/delete/${workoutId}/${dayId}`),
  deleteExercise: (workoutId, dayId, exerciseId) =>
    apiClient.delete(`/workouts/delete/${workoutId}/${dayId}/${exerciseId}`),
  assign: (workoutId, userId) =>
    apiClient.put(`/workouts/assign/${workoutId}/${userId}`, {}),
  unassign: (workoutId, userId) =>
    apiClient.put(`/workouts/unassign/${workoutId}/${userId}`, {}),
};

// Helper function to handle API errors consistently
export const handleApiError = (error, fallbackMsg = "An error occurred") => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return fallbackMsg;
};

export default apiClient;
