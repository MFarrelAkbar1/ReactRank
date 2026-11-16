import { useState } from "react";
import { COUNTRIES } from "./data";
import usePagination from "./hooks/usePagination";
import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const filtered = COUNTRIES.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));
  const { page, totalPages, pageItems, hasPrev, hasNext, prev, next } = usePagination(
    filtered,
    pageSize,
  );

  // TODO: go back to page 1 when the search text or the page size changes

  return (
    <div className="app">
      <h1>Countries</h1>

      <div className="controls">
        <input
          data-testid="search-input"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          data-testid="page-size"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
        </select>
      </div>

      <ul>
        {pageItems.map((country) => (
          <li key={country} data-testid="item">
            {country}
          </li>
        ))}
      </ul>

      <div className="pager">
        <button data-testid="prev-button" onClick={prev} disabled={!hasPrev}>
          Prev
        </button>
        {/* TODO: one button per page (data-testid="page-<n>"), aria-current="page" on the current one */}
        <button data-testid="next-button" onClick={next} disabled={!hasNext}>
          Next
        </button>
      </div>

      <p className="muted" data-testid="page-info">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
