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

    // Skip auth check for login page
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-full border-4 animate-spin mb-4"
            style={{
              borderColor: "var(--accent-primary)",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: "var(--muted)", fontWeight: 500 }}>
            Verifying authorization...
          </p>
        </div>
      </div>
    );
  }

  // If it's the login page, don't show sidebar and navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Get active title from pathname
  const getPageTitle = () => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart
      ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
      : "Dashboard";
  };

  return (
    <div
      className="flex min-h-screen font-sans antialiased"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Toaster position="bottom-right" />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={getPageTitle()} />
        <main className="flex-1 p-8 pb-16 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
