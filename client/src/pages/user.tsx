"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { api } from "@/services/api";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to load user profile");
        // Redirect to login if no token
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    api.logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            width="48"
            height="48"
            className="animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-16 py-10">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            width="48"
            height="48"
            className="mx-auto mb-4 text-red-500"
          />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
      <div
        className="rounded-2xl card-shadow p-6 sm:p-8"
        style={{ backgroundColor: "#FFF3E6" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl md:text-4xl font-serif font-bold"
            style={{ color: "#004643" }}
          >
            Profile
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            <Icon icon="mdi:logout" width="20" height="20" />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Icon
                icon="mdi:account"
                width="48"
                height="48"
                className="text-white"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
              <p className="text-gray-900 dark:text-white text-lg font-medium">
                {user.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
              <p className="text-gray-900 dark:text-white text-lg font-medium">
                {user.email}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User ID
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                {user.id}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push("/user/settings")}
              className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
            >
              <Icon icon="mdi:cog-outline" width="20" height="20" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => router.push("/user/cart")}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition"
            >
              <Icon icon="mdi:shopping-cart" width="20" height="20" />
              <span>Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
