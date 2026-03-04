"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      await login(formData);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err: any) {
      setErrors({ submit: err.message || "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Subtle background texture */}
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />

      <div className="login-card-wrapper">
        {/* Brand mark */}
        <div className="login-brand">
          <span className="login-brand__name">Sera</span>
        </div>

        {/* Glass card */}
        <div className="login-card">
          <div className="login-card__header">
            <h1 className="login-card__title">Welcome back</h1>
            <p className="login-card__sub">Sign in to your Sera account</p>
          </div>

          {errors.submit && (
            <div className="login-error">
              <Icon icon="mdi:alert-circle-outline" width={18} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
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
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="login-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Remember / Forgot */}
            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" className="login-checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="login-forgot">
                Forgot password?
              </Link>
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

          <p className="login-footer-text">
            New to Sera?{" "}
            <Link href="/auth/signup" className="login-signup-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
