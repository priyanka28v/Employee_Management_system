import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

const userContext = createContext();

// Authentication provider handling user state, token persistence, and verification
const authContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token")); // Initialize from localStorage
  const [loading, setLoading] = useState(true);

  // Verify token on mount or when token changes
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          // Invalid token
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <userContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};
export const useAuth = () => useContext(userContext);
export default authContext;
