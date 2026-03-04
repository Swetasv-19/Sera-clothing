import { Icon } from "@iconify/react";

export default function SettingsSection() {
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

          <form className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Current Password
              </label>
              <input
                type="password"
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
                className="w-full p-2.5 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-md text-sm outline-none focus:border-[var(--accent-primary)] transition-colors text-[var(--foreground)]"
                placeholder="Confirm new password"
              />
            </div>

            <button className="btn-primary mt-2 self-start py-2 px-6">
              Update Password
            </button>
          </form>
        </section>

        {/* Preferences */}
        <section className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2 mb-5">
            <Icon icon="mdi:bell-outline" width={20} className="text-muted" />
            Notifications & Preferences
          </h2>

          <div className="flex flex-col gap-5">
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
                className="w-4 h-4 accent-[var(--accent-primary)]"
                defaultChecked
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
                className="w-4 h-4 accent-[var(--accent-primary)]"
                defaultChecked
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
