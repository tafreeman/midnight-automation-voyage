import { useState, useMemo } from "react";
import { ORDERS } from "../data";

type SortCol = "id" | "customer" | "amount" | "date" | "status";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 5;

export default function OrdersPage() {
  const [sortCol, setSortCol] = useState<SortCol>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...ORDERS];
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortCol === "amount") cmp = a.amount - b.amount;
      else cmp = String(a[sortCol]).localeCompare(String(b[sortCol]));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [sortCol, sortDir, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageRows = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const startIdx = (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safeCurrentPage * PAGE_SIZE, filtered.length);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };

  const SortHeader = ({ col, label }: { col: SortCol; label: string }) => (
    <th
      data-testid={`col-${col}`}
      onClick={() => toggleSort(col)}
      className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-left select-none cursor-pointer hover:text-blue-600"
    >
      {label}
      {sortCol === col && <span data-testid="sort-indicator" className="ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-[22px] font-bold mb-5 text-slate-900">Orders</h1>
      <div className="flex justify-between items-center mb-4 gap-3">
        <select data-testid="status-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10">
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <span data-testid="row-count" className="text-[13px] text-slate-500">
          {filtered.length > 0 ? `Showing ${startIdx}–${endIdx} of ${filtered.length} results` : "No results"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div data-testid="empty-table" className="text-center py-12 px-6 text-slate-400 text-[15px] bg-slate-50 rounded-xl border border-dashed border-slate-300">No orders match this filter</div>
      ) : (
        <>
          <table data-testid="data-table" className="w-full border-collapse bg-white border border-slate-200 rounded-[10px] overflow-hidden">
            <thead>
              <tr>
                <SortHeader col="id" label="Order ID" />
                <SortHeader col="customer" label="Customer" />
                <SortHeader col="amount" label="Amount" />
                <SortHeader col="date" label="Date" />
                <SortHeader col="status" label="Status" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} data-testid="table-row" className="hover:bg-slate-50">
                  <td data-testid="cell-id" className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">{row.id}</td>
                  <td data-testid="cell-customer" className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">{row.customer}</td>
                  <td data-testid="cell-amount" className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">${row.amount.toFixed(2)}</td>
                  <td data-testid="cell-date" className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">{row.date}</td>
                  <td data-testid="cell-status" className="px-3.5 py-2.5 text-[13px] border-b border-slate-100">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[row.status.toLowerCase()] || ""}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div data-testid="pagination" className="flex items-center gap-1 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                data-testid={`page-${i + 1}`}
                className={`px-3 py-1.5 border rounded-md text-[13px] cursor-pointer font-sans ${
                  safeCurrentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <span data-testid="page-info" className="text-[13px] text-slate-500 ml-2">Page {safeCurrentPage} of {totalPages}</span>
          </div>
        </>
      )}
    </div>
  );
}
