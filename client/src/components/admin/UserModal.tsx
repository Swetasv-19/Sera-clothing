"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // don't show existing password
        role: user.role || "user",
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      if (user) {
        // If password is empty, don't send it to avoid overwriting with empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete (updateData as any).password;
        }
        await api.put(`/admin/users/${user._id}`, updateData);
      } else {
        await api.post("/admin/users", formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving user:", err);
      setError(
        err.response?.data?.error ||
          "Error saving user. Make sure the email is unique.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300 ease-out">
      <div
        className="w-full max-w-xl bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between padding-around border-b border-[var(--card-border)] bg-[var(--surface-alt)]">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              {user ? "Edit User" : "Add New User"}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1 font-medium">
              {user
                ? "Update user settings and permissions."
                : "Create a new user profile."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            <Icon icon="material-symbols:close" className="text-2xl" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto padding-around scrollbar-hide bg-[var(--surface)]">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="padding-around rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2">
                <Icon
                  icon="material-symbols:error-outline"
                  className="text-lg"
                />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <Icon
                  icon="material-symbols:person-outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-xl"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Icon
                  icon="material-symbols:mail-outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-xl"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                  placeholder="e.g. john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider flex items-center gap-2">
                Password
                {user && (
                  <span className="text-[10px] bg-[var(--surface-alt)] px-2 py-0.5 rounded text-[var(--muted)] normal-case flex items-center gap-1">
                    <Icon icon="material-symbols:info-outline" />
                    Leave blank to keep current
                  </span>
                )}
              </label>
              <div className="relative">
                <Icon
                  icon="material-symbols:lock-outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-xl"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!user}
                  className="w-full padding-around pl-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50 font-medium"
                  placeholder="Enter strong password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full padding-around pl-4 pr-12 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <Icon
                  icon="material-symbols:keyboard-arrow-down"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none text-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--surface-alt)] rounded-xl border border-[var(--card-border)] shrink-0">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  Active Account
                </h4>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Allow this user to log in and access the system
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 shrink-0 bg-[var(--muted)]/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--accent-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--card-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                <span className="ml-3 text-sm font-bold w-16 text-left text-[var(--foreground)] whitespace-nowrap">
                  {formData.isActive ? "Active" : "Disabled"}
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="padding-around border-t border-[var(--card-border)] bg-[var(--surface-alt)] flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-[var(--foreground)] bg-transparent hover:bg-[var(--surface)] border border-[var(--card-border)] rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:save-outline"
                  className="text-lg"
                />
                <span>{user ? "Save Changes" : "Create User"}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
