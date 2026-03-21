import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import { ADMIN_USERS } from "../data";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
}

const DEFAULT_USERS: AdminUser[] = ADMIN_USERS.map((u) => ({ ...u }));

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState<AdminUser[]>(() => {
    const stored = sessionStorage.getItem("admin-users");
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }
    return DEFAULT_USERS.map((u) => ({ ...u }));
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("viewer");
  const [inviteError, setInviteError] = useState("");

  const isViewer = role === "viewer";

  // Persist users to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("admin-users", JSON.stringify(users));
  }, [users]);

  // Auth gating: redirect non-authenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // Redirect non-admin (but not viewer — viewer sees page with disabled actions)
    if (role !== "admin" && role !== "viewer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, role, navigate]);

  const filteredUsers = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleInvite = () => {
    setInviteError("");
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError("Name and email are required.");
      return;
    }
    // Intentional Issue #2: Duplicate email triggers validation error
    if (users.some((u) => u.email === inviteEmail.trim())) {
      setInviteError("A user with this email already exists.");
      return;
    }
    const newUser: AdminUser = {
      id: `u${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "active",
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("viewer");
    addToast("success", `Invited ${newUser.name} as ${newUser.role}.`);
  };

  const handleBulkAction = (action: "activate" | "deactivate") => {
    if (selected.size === 0) return;
    // Intentional Issue #3: Bulk deactivate doesn't update row status until page refresh (stale state bug)
    if (action === "deactivate") {
      const updated = users.map((u) =>
        selected.has(u.id) ? { ...u } : u
      );
      // Bug: not actually updating the status field — stale state
      setUsers(updated);
      addToast("warning", `Deactivated ${selected.size} user(s). Refresh to see updated status.`);
    } else {
      setUsers((prev) =>
        prev.map((u) => (selected.has(u.id) ? { ...u, status: "active" } : u))
      );
      addToast("success", `Activated ${selected.size} user(s).`);
    }
    setSelected(new Set());
  };

  const handleSeedReset = () => {
    setUsers(DEFAULT_USERS.map((u) => ({ ...u })));
    setSelected(new Set());
    setSearch("");
    setRoleFilter("all");
    addToast("info", "Data reset to default seed.");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const roleColors: Record<string, string> = {
    admin: "bg-green-100 text-green-800",
    editor: "bg-blue-100 text-blue-800",
    viewer: "bg-amber-100 text-amber-800",
  };

  const statusBadgeColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-[22px] font-bold mb-5 text-slate-900">Admin Panel</h1>

      {/* Invite User Form */}
      <div className="mb-6 p-5 bg-slate-50 rounded-[10px] border border-slate-200" data-testid="admin-invite-form">
        <h2 className="text-base font-semibold mb-3">Invite User</h2>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label htmlFor="invite-name" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Name</label>
            <input
              id="invite-name"
              data-testid="admin-invite-name"
              type="text"
              value={inviteName}
              onChange={(e) => { setInviteName(e.target.value); setInviteError(""); }}
              placeholder="Full name"
              disabled={isViewer}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="invite-email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              id="invite-email"
              data-testid="admin-invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setInviteError(""); }}
              placeholder="email@company.com"
              disabled={isViewer}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div className="w-[140px]">
            <label htmlFor="invite-role" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Role</label>
            <select
              id="invite-role"
              data-testid="admin-invite-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AdminUser["role"])}
              disabled={isViewer}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        {inviteError && <p className="text-xs text-red-600 mt-1 font-medium">{inviteError}</p>}
        <button
          data-testid="admin-invite-submit"
          className="w-auto py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          onClick={handleInvite}
          disabled={isViewer}
        >
          Send Invite
        </button>
      </div>

      {/* Search/Filter and Seed controls */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <input
          data-testid="admin-search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 min-w-[200px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
        />
        <select
          data-testid="admin-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-[160px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          data-testid="admin-seed-reset"
          className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSeedReset}
          disabled={isViewer}
        >
          Reset Data
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex gap-2 items-center mb-4">
          <span className="text-[13px] text-slate-500">{selected.size} selected</span>
          <button
            data-testid="admin-bulk-action"
            className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("deactivate")}
            disabled={isViewer}
          >
            Deactivate Selected
          </button>
          <button
            className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("activate")}
            disabled={isViewer}
          >
            Activate Selected
          </button>
        </div>
      )}

      {/* User Table */}
      <table className="w-full border-collapse bg-white border border-slate-200 rounded-[10px] overflow-hidden" data-testid="admin-user-table">
        <thead>
          <tr>
            <th className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-left w-10"></th>
            <th className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-left">Name</th>
            <th className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-left">Email</th>
            <th className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-left">Role</th>
            <th className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} data-testid={`admin-user-row-${user.id}`} className="hover:bg-slate-50">
              <td className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">
                <input
                  type="checkbox"
                  data-testid={`admin-bulk-checkbox-${user.id}`}
                  checked={selected.has(user.id)}
                  onChange={() => toggleSelect(user.id)}
                  disabled={isViewer}
                />
              </td>
              <td className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">{user.name}</td>
              <td className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">{user.email}</td>
              <td data-testid={`admin-user-role-${user.id}`} className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${roleColors[user.role] || ""}`}>
                  {user.role}
                </span>
              </td>
              <td data-testid={`admin-user-status-${user.id}`} className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBadgeColors[user.status] || ""}`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8 text-slate-400">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
