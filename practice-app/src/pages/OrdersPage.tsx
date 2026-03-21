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

  const SortHeader = ({ col, label }: { col: SortCol; label: string }) => (
    <th data-testid={`col-${col}`} onClick={() => toggleSort(col)} style={{ cursor: "pointer" }}>
      {label}
      {sortCol === col && <span data-testid="sort-indicator" style={{ marginLeft: 4 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );

  return (
    <div className="page">
      <h1>Orders</h1>
      <div className="table-controls">
        <select data-testid="status-filter" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <span data-testid="row-count" className="row-count">
          {filtered.length > 0 ? `Showing ${startIdx}–${endIdx} of ${filtered.length} results` : "No results"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div data-testid="empty-table" className="empty-state">No orders match this filter</div>
      ) : (
        <>
          <table data-testid="data-table" className="data-table">
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
                <tr key={row.id} data-testid="table-row">
                  <td data-testid="cell-id">{row.id}</td>
                  <td data-testid="cell-customer">{row.customer}</td>
                  <td data-testid="cell-amount">${row.amount.toFixed(2)}</td>
                  <td data-testid="cell-date">{row.date}</td>
                  <td data-testid="cell-status">
                    <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div data-testid="pagination" className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                data-testid={`page-${i + 1}`}
                className={safeCurrentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <span data-testid="page-info">Page {safeCurrentPage} of {totalPages}</span>
          </div>
        </>
      )}
    </div>
  );
}
