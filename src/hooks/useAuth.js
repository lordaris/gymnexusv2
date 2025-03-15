import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { authAPI } from "../utils/apiClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const userId = Cookies.get("user");

      if (token && role && userId) {
        setUser({
          id: userId,
          role,
          isAuthenticated: true,
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      const { token, role, id } = response.data;

      Cookies.set("token", token);
      Cookies.set("role", role);
      Cookies.set("user", id);

      setUser({
        id,
        role,
        isAuthenticated: true,
      });

      return { success: true, role };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    setUser(null);
    router.push("/");
  };

  const isCoach = () => user?.role === "COACH";
  const isAthlete = () => user?.role === "ATHLETE";

  return {
    user,
    loading,
    login,
    logout,
    isCoach,
    isAthlete,
  };
}

// src/hooks/useWorkouts.js
import { useState, useEffect } from "react";
import { workoutsAPI } from "../utils/apiClient";
import { toast } from "react-toastify";

export function useWorkouts(coachId, initialWorkouts = []) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutsAPI.getByCoach(coachId);
      setWorkouts(response.data);
    } catch (err) {
      setError("Failed to load workouts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coachId) {
      fetchWorkouts();
    }
  }, [coachId]);

  const addWorkout = async (workoutData) => {
    try {
      const response = await workoutsAPI.create(workoutData);
      setWorkouts([...workouts, response.data]);
      toast.success("Workout created successfully");
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      await workoutsAPI.delete(workoutId);
      setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
      toast.success("Workout deleted successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    workouts,
    loading,
    error,
    fetchWorkouts,
    addWorkout,
    deleteWorkout,
  };
}

// src/hooks/useUsers.js
import { useState, useEffect } from "react";
import { usersAPI } from "../utils/apiClient";
import { toast } from "react-toastify";

export function useUsers(coachId) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersAPI.getByCoach(coachId);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coachId) {
      fetchUsers();
    }
  }, [coachId]);

  const addUser = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      setUsers([...users, response.data]);
      toast.success("User created successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
      return null;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await usersAPI.delete(userId);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete user");
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    deleteUser,
  };
}
