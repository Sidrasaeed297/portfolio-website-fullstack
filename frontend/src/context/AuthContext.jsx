// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api.js"; // will use baseURL from .env

export const AuthContext = createContext({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!accessToken;

  // Persist token & user in localStorage
  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    // Form‑encoded login as required by FastAPI OAuth2
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, user } = response.data;
      setAccessToken(access_token);
      setUser(user);
      return response.data;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
