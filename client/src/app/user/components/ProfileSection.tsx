import { Icon } from "@iconify/react";
import { useState } from "react";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

interface ProfileSectionProps {
  user: any;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile(formData);
      if (res.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Note: To fully sync UI, auth context user object should ideally be refreshed here
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn flex flex-col gap-[1.75rem]">
      <div className="dash-section-head">
        <h1 className="dash-section-title">Personal Information</h1>
        <p className="dash-section-sub">Manage your Sera profile details</p>
      </div>

      <div className="dash-card">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-6">
            <div className="dash-info-grid">
              <div className="dash-info-field border-none pb-0">
                <label className="dash-info-label mb-2 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-md text-sm outline-none focus:border-[var(--accent-primary)] text-[var(--foreground)]"
                />
              </div>
              <div className="dash-info-field border-none pb-0">
                <label className="dash-info-label mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-md text-sm outline-none focus:border-[var(--accent-primary)] text-[var(--foreground)]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
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
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary dash-edit-btn"
              >
                <Icon icon="mdi:pencil-outline" width={16} />
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

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
