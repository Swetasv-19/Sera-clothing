import { Icon } from "@iconify/react";

interface ProfileSectionProps {
  user: any;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <div className="animate-fadeIn flex flex-col gap-[1.75rem]">
      {/* Section heading */}
      <div className="dash-section-head">
        <h1 className="dash-section-title">Personal Information</h1>
        <p className="dash-section-sub">Manage your Sera profile details</p>
      </div>

      {/* Info card */}
      <div className="dash-card">
        <div className="dash-info-grid">
          <div className="dash-info-field">
            <span className="dash-info-label">Display Name</span>
            <span className="dash-info-value">{user?.name}</span>
          </div>
          <div className="dash-info-field">
            <span className="dash-info-label">Email Address</span>
            <span className="dash-info-value">{user?.email}</span>
          </div>
          <div className="dash-info-field">
            <span className="dash-info-label">Account Role</span>
            <span
              className={`dash-role-badge ${
                user?.role === "admin" ? "dash-role-badge--admin" : ""
              }`}
            >
              {user?.role}
            </span>
          </div>
          <div className="dash-info-field">
            <span className="dash-info-label">Member Since</span>
            <span className="dash-info-value">
              {user?.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(user.createdAt))
                : "Unknown"}
            </span>
          </div>
        </div>

        <div className="dash-card-actions">
          <button className="btn-primary dash-edit-btn">
            <Icon icon="mdi:pencil-outline" width={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon">
            <Icon icon="mdi:package-variant-closed" width={22} />
          </div>
          <div>
            <div className="dash-stat-label">Active Orders</div>
            <div className="dash-stat-value">
              {user?.orders
                ? user.orders.length.toString().padStart(2, "0")
                : "00"}
            </div>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--accent">
            <Icon icon="mdi:star-four-points" width={22} />
          </div>
          <div>
            <div className="dash-stat-label">Loyalty Points</div>
            <div className="dash-stat-value dash-stat-value--accent">
              {user?.loyaltyPoints || 0}
            </div>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon">
            <Icon icon="mdi:heart-outline" width={22} />
          </div>
          <div>
            <div className="dash-stat-label">Wishlist</div>
            <div className="dash-stat-value">
              {user?.wishlist ? user.wishlist.length : "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
