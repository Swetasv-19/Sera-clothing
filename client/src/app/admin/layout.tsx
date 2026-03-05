"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import { Toaster } from "react-hot-toast";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token || !userStr) {
      router.push("/admin/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
        return;
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/admin/login");
      return;
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mb-4" />
          <p className="text-gray-500 font-medium">
            Verifying authorization...
          </p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart
      ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
      : "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <Toaster position="bottom-right" />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto bg-[var(--surface)] flex justify-center">
          <div className="w-full max-w-6xl px-10 py-10 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
