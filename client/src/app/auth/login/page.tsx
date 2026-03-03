"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      router.push("/");
    } catch (err: any) {
      setErrors({ submit: err.message || "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="rounded-2xl card p-8 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-[var(--foreground)]">
              Welcome Back
            </h1>
            <p className="text-[var(--muted)]">Log in to your Sera account</p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
              <Icon icon="mdi:alert-circle-outline" width={20} />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
                />
                <Icon 
                  icon="mdi:email-outline" 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] w-5 h-5" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--foreground)]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
                />
                <Icon 
                  icon="mdi:lock-outline" 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] w-5 h-5" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)]">
                <input type="checkbox" className="rounded border-[var(--divider)] bg-[var(--surface-alt)] text-[var(--accent-primary)]" />
                Remember me
              </label>
              <Link href="#" className="text-[var(--accent-primary)] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin" width={20} />
                  Signing In...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--divider)] text-center">
            <p className="text-[var(--muted)] text-sm">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[var(--accent-secondary)] font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
