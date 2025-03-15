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
