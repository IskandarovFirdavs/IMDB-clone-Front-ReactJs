// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const res = await userService.getCurrentUser();
          setCurrentUser(res.data);
        } catch (err) {
          console.error("Auto login failed", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await userService.login({ username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      const userRes = await userService.getCurrentUser();
      setCurrentUser(userRes.data);
      return true;
    } catch (err) {
      setError("Login failed. Check credentials.");
      return false;
    }
  };

  const register = async (data) => {
    try {
      await userService.register(data);
      return true;
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, register, logout, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
