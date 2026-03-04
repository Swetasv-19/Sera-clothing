import { Icon } from "@iconify/react";
import { useState } from "react";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

export default function SettingsSection() {
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promoEmails: true,
  });
  const [loadingPref, setLoadingPref] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setLoadingPass(true);
    try {
      const res = await userService.updatePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      if (res.success) {
        toast.success("Password updated successfully");
        setPassForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoadingPass(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoadingPref(true);
    try {
      const res = await userService.updatePreferences(preferences);
      if (res.success) {
        toast.success("Preferences saved");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save preferences");
    } finally {
      setLoadingPref(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "WARNING: This action is irreversible. Are you sure you want to delete your account?",
      )
    )
      return;
    try {
      const res = await userService.deleteAccount();
      if (res.success) {
        toast.success("Account deleted");
        // Typically, call authContext.logout() here or redirect to home page
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="dash-section-head mb-6">
        <h1 className="dash-section-title">Account Settings</h1>
        <p className="dash-section-sub">
          Update your password and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Password settings */}
        <section className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2 mb-5">
            <Icon icon="mdi:lock-outline" width={20} className="text-muted" />
            Security & Password
          </h2>

          <form
            onSubmit={handlePasswordUpdate}
            className="flex flex-col gap-4 max-w-md"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passForm.currentPassword}
                onChange={(e) =>
                  setPassForm({ ...passForm, currentPassword: e.target.value })
                }
                className="w-full p-2.5 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-md text-sm outline-none focus:border-[var(--accent-primary)] transition-colors text-[var(--foreground)]"
                placeholder="Enter current password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                New Password
              </label>
              <input
                type="password"
                required
                value={passForm.newPassword}
                onChange={(e) =>
                  setPassForm({ ...passForm, newPassword: e.target.value })
                }
                className="w-full p-2.5 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-md text-sm outline-none focus:border-[var(--accent-primary)] transition-colors text-[var(--foreground)]"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passForm.confirmPassword}
                onChange={(e) =>
                  setPassForm({ ...passForm, confirmPassword: e.target.value })
                }
                className="w-full p-2.5 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-md text-sm outline-none focus:border-[var(--accent-primary)] transition-colors text-[var(--foreground)]"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPass}
              className="btn-primary mt-2 self-start py-2 px-6"
            >
              {loadingPass ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* Preferences */}
        <section className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2 mb-5">
            <Icon icon="mdi:bell-outline" width={20} className="text-muted" />
            Notifications & Preferences
          </h2>

          <div className="flex flex-col gap-5 max-w-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-semibold text-sm text-foreground mb-0.5">
                  Order Updates
                </div>
                <div className="text-xs text-muted">
                  Receive tracking and status updates via email.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.orderUpdates}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    orderUpdates: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-semibold text-sm text-foreground mb-0.5">
                  Promotional Emails
                </div>
                <div className="text-xs text-muted">
                  Get notified about exclusive offers and new collections.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.promoEmails}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    promoEmails: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
            </label>

            <button
              onClick={handlePreferencesUpdate}
              disabled={loadingPref}
              className="btn-outline mt-2 self-start px-6 py-2 text-sm"
            >
              {loadingPref ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="card p-6 border-red-500/20 bg-red-500/5 dark:bg-red-500/5">
          <h2 className="text-lg font-serif font-semibold text-red-500 flex items-center gap-2 mb-2">
            <Icon icon="mdi:alert-circle-outline" width={20} />
            Danger Zone
          </h2>
          <p className="text-sm text-foreground/80 mb-5">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="btn-primary !bg-red-500 hover:!bg-red-600 text-white"
          >
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
}
