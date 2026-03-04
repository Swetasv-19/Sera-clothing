"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      setErrors({
        submit: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Ambient background orbs */}
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
            <div className="login-card__title">Create Account</div>
            <p className="login-card__sub">
              Start your style journey with Sera
            </p>
          </div>

          {errors.submit && (
            <div className="login-error">
              <Icon icon="mdi:alert-circle-outline" width={18} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Full Name */}
            <div className="login-field">
              <label className="login-label">Full Name</label>
              <div className="login-input-wrap">
                <Icon
                  icon="mdi:account-outline"
                  className="login-input-icon"
                  width={18}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="login-input"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="login-field-error">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email Address</label>
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
              {errors.email && (
                <p className="login-field-error">{errors.email}</p>
              )}
            </div>

            {/* Password pair */}
            <div className="login-pw-pair">
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
                    autoComplete="new-password"
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
                {errors.password && (
                  <p className="login-field-error">{errors.password}</p>
                )}
              </div>

              <div className="login-field">
                <label className="login-label">Confirm</label>
                <div className="login-input-wrap">
                  <Icon
                    icon="mdi:lock-check-outline"
                    className="login-input-icon"
                    width={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="login-input"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="login-field-error">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-submit"
              style={{ marginTop: "0.5rem" }}
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="animate-spin"
                    width={18}
                  />
                  Creating Account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="login-footer-text">
            Already have an account?{" "}
            <Link href="/auth/login" className="login-signup-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
