"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        }
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("users/login", { email, password });

      if (data.user.role !== "admin") {
        setError("Access denied: Admin privileges required");
        toast.error("Access denied: Admin privileges required", { duration: 4000 });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back, Admin!", { duration: 4000 });
      router.push("/admin/dashboard");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid email or password";
      setError(errMsg);
      toast.error(errMsg, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: "100vh" }}>
      {/* Subtle background texture */}
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />

      <div className="login-card-wrapper">
        <div className="login-brand">
          <span className="login-brand__name">Sera Admin</span>
        </div>

        <div className="login-card">
          <div className="login-card__header">
            <h1 className="login-card__title">Admin Panel</h1>
            <p className="login-card__sub">
              Please sign in to your admin account
            </p>
          </div>

          {error && (
            <div className="login-error">
              <Icon icon="mdi:alert-circle-outline" width={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Email address</label>
              <div className="login-input-wrap">
                <Icon
                  icon="mdi:email-outline"
                  className="login-input-icon"
                  width={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@seraclothing.com"
                  className="login-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <Icon
                  icon="mdi:lock-outline"
                  className="login-input-icon"
                  width={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="login-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  aria-label="Toggle password visibility"
                >
                  <Icon
                    icon={
                      showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                    }
                    width={18}
                  />
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="login-submit">
              {isLoading ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="animate-spin"
                    width={18}
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
