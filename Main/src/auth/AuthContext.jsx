import React, { createContext, useContext, useState, useEffect } from "react";
import api from "api/client";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
        console.log("Fetched user:", res.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error(err);
        }
        setUser(null);
      } finally {
        setAuthLoading(false); // 🔑 THIS LINE FIXES NEW TAB ISSUE
      }
    };

    fetchMe();
  }, []);

  const login = async (username, password) => {
    // 1. Login and receive cookie
    await api.post("/api/auth/login", { username, password });

    // 2. Immediately ask backend "Who am I?"
    const res = await api.get("/api/auth/me");

    // 3. Update user in AuthContext
    setUser(res.data);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch {
      // even if backend fails, proceed
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
