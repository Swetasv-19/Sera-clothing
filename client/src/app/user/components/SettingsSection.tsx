"use client";

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
  const [showPass, setShowPass] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [loadingPass, setLoadingPass] = useState(false);

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promoEmails: true,
  });
  const [loadingPref, setLoadingPref] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePass, setShowDeletePass] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passForm.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
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
      if (res.success) toast.success("Preferences saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save preferences");
    } finally {
      setLoadingPref(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error("Please enter your password");
    setLoadingDelete(true);
    try {
      const res = await userService.deleteAccount(deletePassword);
      if (res.success) {
        toast.success("Account deleted");
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err.message || "Incorrect password");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="dash-section-head mb-8">
        <h1 className="dash-section-title">Settings</h1>
        <p className="dash-section-sub">
          Manage your account security and preferences.
        </p>
      </div>

      <div className="settings-stack">
        {/* ── Password Section ─────────────────────────────────── */}
        <div className="settings-card margin-top">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Icon icon="mdi:lock-outline" width={18} />
            </div>
            <div>
              <h2 className="settings-card-title">Password & Security</h2>
              <p className="settings-card-desc">
                Update your login credentials.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="settings-form">
            {/* Current Password */}
            <div className="settings-field">
              <label htmlFor="currentPw" className="settings-label">
                Current password
              </label>
              <div className="settings-input-wrap">
                <input
                  id="currentPw"
                  type={showPass.current ? "text" : "password"}
                  required
                  value={passForm.currentPassword}
                  onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="settings-input"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="settings-eye"
                  onClick={() =>
                    setShowPass((s) => ({ ...s, current: !s.current }))
                  }
                  aria-label={
                    showPass.current ? "Hide password" : "Show password"
                  }
                >
                  <Icon
                    icon={showPass.current ? "mdi:eye-off" : "mdi:eye"}
                    width={17}
                  />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="settings-field">
              <label htmlFor="newPw" className="settings-label">
                New password
              </label>
              <div className="settings-input-wrap">
                <input
                  id="newPw"
                  type={showPass.newPass ? "text" : "password"}
                  required
                  value={passForm.newPassword}
                  onChange={(e) =>
                    setPassForm({ ...passForm, newPassword: e.target.value })
                  }
                  className="settings-input"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="settings-eye"
                  onClick={() =>
                    setShowPass((s) => ({ ...s, newPass: !s.newPass }))
                  }
                  aria-label={
                    showPass.newPass ? "Hide password" : "Show password"
                  }
                >
                  <Icon
                    icon={showPass.newPass ? "mdi:eye-off" : "mdi:eye"}
                    width={17}
                  />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="settings-field">
              <label htmlFor="confirmPw" className="settings-label">
                Confirm new password
              </label>
              <div className="settings-input-wrap">
                <input
                  id="confirmPw"
                  type={showPass.confirm ? "text" : "password"}
                  required
                  value={passForm.confirmPassword}
                  onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="settings-input"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="settings-eye"
                  onClick={() =>
                    setShowPass((s) => ({ ...s, confirm: !s.confirm }))
                  }
                  aria-label={
                    showPass.confirm ? "Hide password" : "Show password"
                  }
                >
                  <Icon
                    icon={showPass.confirm ? "mdi:eye-off" : "mdi:eye"}
                    width={17}
                  />
                </button>
              </div>
              {passForm.confirmPassword &&
                passForm.newPassword !== passForm.confirmPassword && (
                  <p className="settings-field-error">Passwords do not match</p>
                )}
            </div>

            <div className="settings-form-actions">
              <button
                type="submit"
                disabled={loadingPass}
                className="settings-btn-primary"
              >
                {loadingPass ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin"
                      width={16}
                    />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Notifications Section ────────────────────────────── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Icon icon="mdi:bell-outline" width={18} />
            </div>
            <div>
              <h2 className="settings-card-title">Notifications</h2>
              <p className="settings-card-desc">Choose what you hear about.</p>
            </div>
          </div>

          <div className="settings-prefs">
            <label className="settings-toggle-row" htmlFor="orderUpdates">
              <div className="settings-toggle-info">
                <span className="settings-toggle-title">Order updates</span>
                <span className="settings-toggle-desc">
                  Shipping and delivery status emails for your orders.
                </span>
              </div>
              <div className="settings-toggle-wrap">
                <input
                  id="orderUpdates"
                  type="checkbox"
                  className="settings-toggle-input"
                  checked={preferences.orderUpdates}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      orderUpdates: e.target.checked,
                    })
                  }
                />
                <span className="settings-toggle-thumb" aria-hidden="true" />
              </div>
            </label>

            <div className="settings-pref-divider" />

            <label className="settings-toggle-row" htmlFor="promoEmails">
              <div className="settings-toggle-info">
                <span className="settings-toggle-title">
                  Promotional emails
                </span>
                <span className="settings-toggle-desc">
                  Exclusive offers, new arrivals, and seasonal sales.
                </span>
              </div>
              <div className="settings-toggle-wrap">
                <input
                  id="promoEmails"
                  type="checkbox"
                  className="settings-toggle-input"
                  checked={preferences.promoEmails}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      promoEmails: e.target.checked,
                    })
                  }
                />
                <span className="settings-toggle-thumb" aria-hidden="true" />
              </div>
            </label>

            <div
              className="settings-form-actions"
              style={{ marginTop: "1.5rem" }}
            >
              <button
                onClick={handlePreferencesUpdate}
                disabled={loadingPref}
                className="settings-btn-primary"
              >
                {loadingPref ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin"
                      width={16}
                    />
                    Saving…
                  </>
                ) : (
                  "Save preferences"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Danger Zone ──────────────────────────────────────── */}
        <div className="settings-card settings-card--danger">
          <div className="settings-card-header">
            <div className="settings-card-icon settings-card-icon--danger">
              <Icon icon="mdi:alert-circle-outline" width={18} />
            </div>
            <div>
              <h2 className="settings-card-title settings-card-title--danger">
                Danger zone
              </h2>
              <p className="settings-card-desc">
                Permanent and irreversible account actions.
              </p>
            </div>
          </div>

          <div className="settings-danger-body">
            <div className="settings-danger-desc">
              <p>
                Deleting your account will permanently remove all your data
                including orders, saved addresses, and preferences. This cannot
                be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="settings-btn-danger"
            >
              <Icon icon="mdi:trash-can-outline" width={16} />
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      {showDeleteModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setDeletePassword("");
            setShowDeletePass(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-icon">
              <Icon icon="mdi:alert-circle-outline" width={28} />
            </div>
            <h3 id="delete-modal-title" className="settings-modal-title">
              Delete your account?
            </h3>
            <p className="settings-modal-desc">
              This action is <strong>permanent</strong> and cannot be undone.
              Enter your password to confirm.
            </p>

            {/* Password confirmation field */}
            <div className="settings-modal-field">
              <div className="settings-input-wrap">
                <input
                  type={showDeletePass ? "text" : "password"}
                  className="settings-input"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDeleteAccount()}
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="settings-eye"
                  onClick={() => setShowDeletePass((v) => !v)}
                  aria-label={
                    showDeletePass ? "Hide password" : "Show password"
                  }
                >
                  <Icon
                    icon={showDeletePass ? "mdi:eye-off" : "mdi:eye"}
                    width={17}
                  />
                </button>
              </div>
            </div>

            <div className="settings-modal-actions">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setShowDeletePass(false);
                }}
                className="settings-btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loadingDelete || !deletePassword}
                className="settings-btn-danger"
              >
                {loadingDelete ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin"
                      width={16}
                    />
                    Deleting…
                  </>
                ) : (
                  "Delete my account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
