import { useState } from "react";
import { PRODUCTS } from "../data";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [category, setCategory] = useState("All");

  const doSearch = () => setActiveQuery(query);

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = !activeQuery || p.name.toLowerCase().includes(activeQuery.toLowerCase());
    const matchesCat = category === "All" || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page">
      <h1>Products</h1>
      <div className="search-bar">
        <input
          data-testid="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder="Search products..."
        />
        <button data-testid="search-button" onClick={doSearch} className="btn-primary">Search</button>
        <select
          data-testid="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
      </div>

      <p data-testid="result-count" className="result-count">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
      </p>

      {filtered.length === 0 ? (
        <div data-testid="no-results" className="empty-state">No products found</div>
      ) : (
        <div data-testid="results-list" className="results-grid">
          {filtered.map((p) => (
            <div key={p.id} data-testid="result-card" className="product-card">
              <span data-testid="product-image" className="product-image">{p.image}</span>
              <h3 data-testid="product-name">{p.name}</h3>
              <p data-testid="product-price">${p.price.toFixed(2)}</p>
              <span className="product-category">{p.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
