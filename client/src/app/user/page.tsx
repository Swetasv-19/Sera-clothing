"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Icon icon="mdi:loading" className="animate-spin text-[var(--accent-primary)]" width={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container-padded py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <div className="p-6 rounded-2xl card mb-4 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-3xl font-serif mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">{user.name}</h2>
              <p className="text-sm text-[var(--muted)]">{user.email}</p>
            </div>

            {[
              { icon: "mdi:account-outline", label: "Profile Information", active: true },
              { icon: "mdi:package-variant-closed", label: "My Orders", path: "/user/orders" },
              { icon: "mdi:heart-outline", label: "Wishlist", path: "/user/wishlist" },
              { icon: "mdi:map-marker-outline", label: "Shipping Addresses", path: "/user/addresses" },
              { icon: "mdi:cog-outline", label: "Account Settings", path: "/user/settings" },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active 
                  ? "bg-[var(--accent-primary)] text-white shadow-md" 
                  : "text-[var(--foreground)] hover:bg-[var(--muted-light)]"
                }`}
              >
                <Icon icon={item.icon} width={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}

            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
            >
              <Icon icon="mdi:logout" width={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-2xl card">
              <h3 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-8">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Display Name</label>
                  <p className="text-lg font-medium text-[var(--foreground)] py-2 border-b border-[var(--divider)]">
                    {user.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Email Address</label>
                  <p className="text-lg font-medium text-[var(--foreground)] py-2 border-b border-[var(--divider)]">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Account Role</label>
                  <div className="flex items-center gap-2 py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                      user.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Member Since</label>
                  <p className="text-lg font-medium text-[var(--foreground)] py-2">
                    March 2024
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <button className="btn-primary">Edit Profile</button>
              </div>
            </div>

            {/* Quick Stats/Links */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[var(--surface-alt)] border border-[var(--divider)]">
                <h4 className="text-[var(--muted)] text-sm font-bold uppercase mb-2">Active Orders</h4>
                <p className="text-3xl font-serif font-bold text-[var(--foreground)]">02</p>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--surface-alt)] border border-[var(--divider)]">
                <h4 className="text-[var(--muted)] text-sm font-bold uppercase mb-2">Loyalty Points</h4>
                <p className="text-3xl font-serif font-bold text-[var(--accent-secondary)]">450</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
