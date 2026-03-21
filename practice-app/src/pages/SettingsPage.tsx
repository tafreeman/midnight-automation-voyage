import { useState, useRef, useEffect } from "react";
import { useToast } from "../ToastContext";

type Tab = "profile" | "security" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showConfirm, setShowConfirm] = useState(false);
  const { addToast } = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Profile state
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("user@test.com");
  const [bio, setBio] = useState("");

  // Security state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");

  // Notification state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [notifSms, setNotifSms] = useState(false);

  // Intentional A11y Violation #3: Incorrect initial focus in confirm dialog
  // Focuses cancel button instead of the dialog container
  useEffect(() => {
    if (showConfirm && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [showConfirm]);

  const handleProfileSave = () => {
    if (!name.trim() || !email.trim()) {
      addToast("error", "Name and email are required.");
      return;
    }
    addToast("success", "Profile saved successfully.");
  };

  const handlePasswordChange = () => {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All password fields are required.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    addToast("success", "Password changed successfully.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const handleNotificationSave = () => {
    addToast("success", "Notification preferences saved.");
  };

  const handleDeleteAccount = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    addToast("warning", "Account deletion requested. This is a demo.");
  };

  const tabs: { key: Tab; label: string; testId: string }[] = [
    { key: "profile", label: "Profile", testId: "settings-profile-tab" },
    { key: "security", label: "Security", testId: "settings-security-tab" },
    { key: "notifications", label: "Notifications", testId: "settings-notifications-tab" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-[22px] font-bold mb-5 text-slate-900">Settings</h1>

      {/* Tab navigation — keyboard-navigable */}
      <div className="flex gap-1 mb-5 border-b border-slate-200" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            data-testid={tab.testId}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`px-[18px] py-2.5 text-[13px] font-medium border-none bg-transparent cursor-pointer border-b-2 transition-all font-sans ${
              activeTab === tab.key
                ? "text-blue-600 border-b-blue-600"
                : "text-slate-500 border-b-transparent hover:text-slate-800"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl border border-slate-200 p-8" role="tabpanel" aria-label="Profile settings">
          <div className="mb-4">
            <label htmlFor="settings-name" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              id="settings-name"
              data-testid="settings-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="settings-email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              id="settings-email"
              data-testid="settings-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            />
          </div>
          <div className="mb-4">
            {/* Intentional A11y Violation #1: Missing <label> binding on bio textarea.
                Uses placeholder only — invisible to screen readers (WCAG 1.3.1, 4.1.2) */}
            <textarea
              data-testid="settings-bio-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors resize-y focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            />
          </div>
          <button
            data-testid="settings-save-button"
            className="w-auto py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700"
            onClick={handleProfileSave}
          >
            Save Profile
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white rounded-xl border border-slate-200 p-8" role="tabpanel" aria-label="Security settings">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="mb-4">
            <label htmlFor="settings-current-pw" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Current Password</label>
            <input
              id="settings-current-pw"
              data-testid="settings-current-password"
              type="password"
              value={currentPw}
              onChange={(e) => { setCurrentPw(e.target.value); setPwError(""); }}
              placeholder="Enter current password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="settings-new-pw" className="block text-[13px] font-semibold text-gray-700 mb-1.5">New Password</label>
            <input
              id="settings-new-pw"
              data-testid="settings-new-password"
              type="password"
              value={newPw}
              onChange={(e) => { setNewPw(e.target.value); setPwError(""); }}
              placeholder="Enter new password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            />
            {/* Intentional A11y Violation #2: Low-contrast helper text.
                Uses a color that fails WCAG AA 4.5:1 contrast ratio */}
            <p className="settings-helper-low-contrast">
              Must be at least 8 characters with a mix of letters and numbers.
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="settings-confirm-pw" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              id="settings-confirm-pw"
              data-testid="settings-confirm-password"
              type="password"
              value={confirmPw}
              onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }}
              placeholder="Confirm new password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
            />
          </div>
          {pwError && <p className="text-xs text-red-600 mt-1 font-medium">{pwError}</p>}
          <button
            data-testid="settings-save-button"
            className="w-auto py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700 mb-6"
            onClick={handlePasswordChange}
          >
            Change Password
          </button>

          <hr className="border-none border-t border-slate-200 my-6" />
          <h2 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
          <p className="text-[13px] text-slate-500 mb-4">
            Permanently delete your account and all data.
          </p>
          <button
            className="w-auto py-2.5 px-5 bg-red-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-red-700"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-slate-200 p-8" role="tabpanel" aria-label="Notification settings">
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <strong>Email Notifications</strong>
              <p className="text-[13px] text-slate-500 mt-0.5">Receive updates via email</p>
            </div>
            <label className="toggle-switch">
              <input
                data-testid="settings-notification-email"
                type="checkbox"
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <strong>Push Notifications</strong>
              <p className="text-[13px] text-slate-500 mt-0.5">Receive push notifications in browser</p>
            </div>
            <label className="toggle-switch">
              <input
                data-testid="settings-notification-push"
                type="checkbox"
                checked={notifPush}
                onChange={(e) => setNotifPush(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div>
              <strong>SMS Notifications</strong>
              <p className="text-[13px] text-slate-500 mt-0.5">Receive text message alerts</p>
            </div>
            <label className="toggle-switch">
              <input
                data-testid="settings-notification-sms"
                type="checkbox"
                checked={notifSms}
                onChange={(e) => setNotifSms(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <button
            data-testid="settings-save-button"
            className="w-auto py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700 mt-4"
            onClick={handleNotificationSave}
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* Confirm Dialog — Intentional A11y Violation #3: focuses Cancel not dialog container */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9998]" data-testid="settings-confirm-dialog">
          <div
            className="bg-white rounded-xl p-7 max-w-[420px] w-[90%] shadow-2xl"
            role="alertdialog"
            aria-label="Confirm account deletion"
          >
            <h3 className="text-lg font-bold mb-2">Delete Account?</h3>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">This action is permanent and cannot be undone. All your data will be deleted.</p>
            <div className="flex gap-3 justify-end">
              <button
                ref={cancelRef}
                className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="w-auto py-2.5 px-5 bg-red-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
