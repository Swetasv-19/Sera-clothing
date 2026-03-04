import { Icon } from "@iconify/react";

export type TabType =
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "settings";

interface SidebarProps {
  user: any;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  logout: () => void;
}

const NAV_ITEMS: { id: TabType; icon: string; label: string }[] = [
  { id: "profile", icon: "mdi:account-outline", label: "Profile" },
  { id: "orders", icon: "mdi:package-variant-closed", label: "My Orders" },
  { id: "wishlist", icon: "mdi:heart-outline", label: "Wishlist" },
  { id: "addresses", icon: "mdi:map-marker-outline", label: "Addresses" },
  { id: "settings", icon: "mdi:cog-outline", label: "Settings" },
];

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  logout,
}: SidebarProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <aside className="dash-sidebar">
      {/* Avatar card */}
      <div className="dash-avatar-card">
        <div className="dash-avatar">{initials}</div>
        <div className="dash-avatar-name">{user?.name}</div>
        <div className="dash-avatar-email">{user?.email}</div>
        <div
          className={`dash-role-badge ${
            user?.role === "admin" ? "dash-role-badge--admin" : ""
          }`}
        >
          {user?.role || "user"}
        </div>
      </div>

      {/* Nav */}
      <nav className="dash-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`dash-nav-item ${
              activeTab === item.id ? "dash-nav-item--active" : ""
            }`}
          >
            <Icon icon={item.icon} width={18} />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="dash-nav-divider" />

        <button
          onClick={logout}
          className="dash-nav-item dash-nav-item--danger"
        >
          <Icon icon="mdi:logout" width={18} />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
