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
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-[22px] font-bold mb-5 text-slate-900">Products</h1>
      <div className="flex gap-2 mb-4 items-center">
        <input
          data-testid="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder="Search products..."
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
        />
        <button data-testid="search-button" onClick={doSearch} className="py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700">Search</button>
        <select
          data-testid="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-[180px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
      </div>

      <p data-testid="result-count" className="text-[13px] text-slate-500 mb-4">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
      </p>

      {filtered.length === 0 ? (
        <div data-testid="no-results" className="text-center py-12 px-6 text-slate-400 text-[15px] bg-slate-50 rounded-xl border border-dashed border-slate-300">No products found</div>
      ) : (
        <div data-testid="results-list" className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {filtered.map((p) => (
            <div key={p.id} data-testid="result-card" className="bg-white border border-slate-200 rounded-[10px] p-5 text-center transition-shadow hover:shadow-md">
              <span data-testid="product-image" className="text-4xl block mb-2.5">{p.image}</span>
              <h3 data-testid="product-name" className="text-sm font-semibold mb-1">{p.name}</h3>
              <p data-testid="product-price" className="text-base font-bold text-blue-600">${p.price.toFixed(2)}</p>
              <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{p.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
