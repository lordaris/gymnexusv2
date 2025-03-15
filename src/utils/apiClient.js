import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
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

    // Handle authentication errors
    if (response && response.status === 401) {
      toast.error("Your session has expired. Please log in again.");

      // Clear cookies and redirect to login
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("user");

      // Only redirect in browser environment
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Show error message for all other errors
    const errorMessage =
      response?.data?.message ||
      "An unexpected error occurred. Please try again.";

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

// API endpoints - Authentication
export const authAPI = {
  login: (credentials) => apiClient.post("/users/login", credentials),
  signup: (userData) => apiClient.post("/users/signup", userData),
  validateToken: () => apiClient.get("/users/validate-token"),
  signup: (userData) => apiClient.post("/users/signup", userData),
};

// API endpoints - Users
export const usersAPI = {
  getAll: () => apiClient.get("/users"),
  getById: (id) => apiClient.get(`/users/by-user-id/${id}`),
  getByCoach: (coachId) => apiClient.get(`/users/by-coach/${coachId}`),
  update: (id, userData) => apiClient.put(`/users/profile/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/profile/${id}`),
  addMetrics: (userId, metricsData) =>
    apiClient.post(`/users/profile/metrics/${userId}`, metricsData),
};

// API endpoints - Workouts
export const workoutsAPI = {
  getAll: () => apiClient.get("/workouts/list"),
  getByCoach: (coachId) => apiClient.get(`/workouts/list/coach/${coachId}`),
  getById: (id) => apiClient.get(`/workouts/list/by-id/${id}`),
  getAssigned: (userId) => apiClient.get(`/workouts/list/assigned/${userId}`),
  create: (workoutData) => apiClient.post("/workouts/create", workoutData),
  addDay: (workoutId, dayData) =>
    apiClient.post(`/workouts/create/${workoutId}`, dayData),
  addExercise: (workoutId, dayId, exerciseData) =>
    apiClient.post(`/workouts/create/${workoutId}/${dayId}`, exerciseData),
  update: (workoutId, dayId, exerciseId, exerciseData) =>
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

export default apiClient;
