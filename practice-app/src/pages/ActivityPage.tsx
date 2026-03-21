import { useState, useEffect, useCallback } from "react";
import { useToast } from "../ToastContext";

type ActivityType = "login" | "purchase" | "settings" | "admin";
type MockMode = "normal" | "error" | "timeout" | "empty" | "stale-cache";

interface Activity {
  id: string;
  type: ActivityType;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

const SEED_ACTIVITIES: Activity[] = [
  { id: "act-1", type: "login", user: "Alice Johnson", action: "Logged in", timestamp: "2026-03-21T09:15:00Z", details: "Successful login from Chrome on Windows" },
  { id: "act-2", type: "purchase", user: "Bob Smith", action: "Purchased Widget Pro", timestamp: "2026-03-21T09:22:00Z", details: "Order ORD-016, amount $29.99, payment via Visa" },
  { id: "act-3", type: "settings", user: "Carol White", action: "Updated profile", timestamp: "2026-03-21T09:30:00Z", details: "Changed display name and email preferences" },
  { id: "act-4", type: "login", user: "David Brown", action: "Failed login attempt", timestamp: "2026-03-21T09:45:00Z", details: "Invalid password, attempt 3 of 5" },
  { id: "act-5", type: "admin", user: "Admin User", action: "Invited new user", timestamp: "2026-03-21T10:00:00Z", details: "Invited frank@company.com as editor" },
  { id: "act-6", type: "purchase", user: "Eve Davis", action: "Purchased Super Gadget", timestamp: "2026-03-21T10:15:00Z", details: "Order ORD-017, amount $89.99, payment via PayPal" },
  { id: "act-7", type: "settings", user: "Frank Miller", action: "Changed password", timestamp: "2026-03-21T10:30:00Z", details: "Password updated successfully" },
  { id: "act-8", type: "login", user: "Grace Lee", action: "Logged in", timestamp: "2026-03-21T10:45:00Z", details: "Successful login from Safari on macOS" },
  { id: "act-9", type: "admin", user: "Admin User", action: "Reset seed data", timestamp: "2026-03-21T11:00:00Z", details: "All user data reset to defaults" },
  { id: "act-10", type: "purchase", user: "Henry Wilson", action: "Purchased Cozy Blanket", timestamp: "2026-03-21T11:15:00Z", details: "Order ORD-018, amount $34.99, payment via Visa" },
];

const TYPE_COLORS: Record<ActivityType, string> = {
  login: "#2563eb",
  purchase: "#16a34a",
  settings: "#d97706",
  admin: "#7c3aed",
};

export default function ActivityPage() {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState<MockMode>("normal");
  const [error, setError] = useState<string | null>(null);

  // Simulated fetch with mock modes
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Simulate network delay
    const delay = mockMode === "timeout" ? 3000 : 400;
    await new Promise((r) => setTimeout(r, delay));

    if (mockMode === "error") {
      setLoading(false);
      setError("500 Internal Server Error — Failed to fetch activity feed.");
      return;
    }

    if (mockMode === "empty") {
      setActivities([]);
      setLoading(false);
      return;
    }

    if (mockMode === "stale-cache") {
      // Intentional: return data with old timestamps (stale cache simulation)
      const stale = SEED_ACTIVITIES.map((a) => ({
        ...a,
        timestamp: "2026-01-01T00:00:00Z",
      }));
      setActivities(stale);
      setLoading(false);
      addToast("warning", "Showing cached data — server may be unavailable.");
      return;
    }

    setActivities([...SEED_ACTIVITIES]);
    setLoading(false);
  }, [mockMode, addToast]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filtered = filter === "all"
    ? activities
    : activities.filter((a) => a.type === filter);

  const selected = activities.find((a) => a.id === selectedId);

  const filters: { key: ActivityType | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "login", label: "Login" },
    { key: "purchase", label: "Purchase" },
    { key: "settings", label: "Settings" },
    { key: "admin", label: "Admin" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-[22px] font-bold mb-5 text-slate-900">Activity Feed</h1>

      {/* Mock mode controls — for testing */}
      <div className="flex gap-1.5 items-center mb-4 px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 flex-wrap" data-testid="activity-mock-controls">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Simulate:
        </span>
        {(["normal", "error", "timeout", "empty", "stale-cache"] as MockMode[]).map((mode) => (
          <button
            key={mode}
            data-testid={`activity-mode-${mode}`}
            className={`inline-block py-1 px-2.5 border rounded-lg text-xs font-medium cursor-pointer transition-all font-sans ${
              mockMode === mode
                ? "bg-blue-50 text-blue-600 border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
            onClick={() => setMockMode(mode)}
          >
            {mode}
          </button>
        ))}
        <button
          data-testid="activity-refresh"
          className="inline-block py-1 px-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400"
          onClick={fetchActivities}
        >
          Refresh
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 mb-4" data-testid="activity-filters">
        {filters.map((f) => (
          <button
            key={f.key}
            data-testid={`activity-filter-${f.key}`}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-all font-sans ${
              filter === f.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            }`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div data-testid="activity-loading" className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-[60px] h-[22px] rounded-md skeleton-shimmer" />
              <div className="flex-1 h-3.5 rounded skeleton-shimmer" />
              <div className="w-[60px] h-3 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div data-testid="activity-error" className="text-center py-8 text-[13px] text-red-600 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg font-medium">
          <p>{error}</p>
          <button className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400 mt-3" onClick={fetchActivities}>
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div data-testid="activity-empty" className="text-center py-12 px-6 text-slate-400 text-[15px] bg-slate-50 rounded-xl border border-dashed border-slate-300">
          No activity found{filter !== "all" ? ` for "${filter}"` : ""}.
        </div>
      )}

      {/* Activity list + detail drawer */}
      {!loading && !error && filtered.length > 0 && (
        <div className="flex gap-5">
          <div className="flex-1" data-testid="activity-list">
            {filtered.map((act) => (
              <div
                key={act.id}
                data-testid={`activity-row-${act.id}`}
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg mb-1.5 cursor-pointer transition-all bg-white ${
                  selectedId === act.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-400"
                }`}
                onClick={() => setSelectedId(act.id)}
              >
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide flex-shrink-0"
                  style={{ background: `${TYPE_COLORS[act.type]}20`, color: TYPE_COLORS[act.type] }}
                >
                  {act.type}
                </span>
                <div className="flex-1 flex flex-col gap-0.5">
                  <strong className="text-[13px]">{act.user}</strong>
                  <span className="text-xs text-slate-500">{act.action}</span>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>

          {/* Detail drawer */}
          {selected && (
            <div className="w-80 flex-shrink-0 p-5 bg-white border border-slate-200 rounded-[10px]" data-testid="activity-detail">
              <h3 className="text-base font-semibold mb-3">{selected.action}</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-1"><strong>User:</strong> {selected.user}</p>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-1"><strong>Type:</strong> {selected.type}</p>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-1"><strong>Time:</strong> {new Date(selected.timestamp).toLocaleString()}</p>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-1"><strong>Details:</strong> {selected.details}</p>
              <button
                data-testid="activity-detail-close"
                className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400 mt-4"
                onClick={() => setSelectedId(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
