"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/user";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        try {
          // Verify token with server
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            authService.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("Auth init error:", error);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Cross-tab sync: handle token/user changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        if (!e.newValue) {
          // Logged out in another tab
          setUser(null);
        } else if (e.key === "user") {
          // Logged in or updated in another tab
          try {
            setUser(JSON.parse(e.newValue));
          } catch (err) {
            console.error("Error parsing user from storage:", err);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (credentials: any) => {
    const response = await authService.login(credentials);
    if (response.user) {
      setUser(response.user);
    }
  };

  const signup = async (userData: any) => {
    const response = await authService.signup(userData);
    if (response.user) {
      setUser(response.user);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
