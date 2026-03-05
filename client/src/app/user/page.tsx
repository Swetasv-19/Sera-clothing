"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import Sidebar, { TabType } from "./components/Sidebar";
import ProfileSection from "./components/ProfileSection";
import OrdersSection from "./components/OrdersSection";
import WishlistSection from "./components/WishlistSection";
import AddressesSection from "./components/AddressesSection";
import SettingsSection from "./components/SettingsSection";

const VALID_TABS: TabType[] = [
  "profile",
  "orders",
  "wishlist",
  "addresses",
  "settings",
];

export default function UserDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = (searchParams?.get("tab") ?? null) as TabType | null;
  const initialTab: TabType =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "profile";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // If the URL ?tab param changes (e.g. back button), sync state
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="dash-loading">
        <Icon icon="mdi:loading" className="animate-spin" width={36} />
      </div>
    );
  }

  if (!user) return null;

  const renderSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection user={user} />;
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      case "addresses":
        return <AddressesSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Sidebar Component */}
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          logout={logout}
        />

        {/* Main Content Area */}
        <main className="dash-main">{renderSection()}</main>
      </div>
    </div>
  );
}
