import { useState } from "react";
import "./styles.css";

export const SEARCH_URL = "https://dummyjson.com/users/search";
export const DEBOUNCE_MS = 300;

export default function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // ⚠️ Problems:
    //  - calls the API on EVERY keystroke (no debounce)
    //  - the query is not trimmed or encoded, and empty queries are sent
    //  - a slow, older response can overwrite a newer one (race condition)
    //  - no loading / error / "no results" states
    fetch(`${SEARCH_URL}?q=${value}`)
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {});
  };

  return (
    <div className="app">
      <h1>User Search</h1>
      <input
        data-testid="search-input"
        className="search"
        placeholder="Search users…"
        value={query}
        onChange={handleChange}
      />

      <ul data-testid="result-list" className="results">
        {users.map((user) => (
          <li key={user.id} data-testid="result-item">
            <span data-testid="result-name">
              {user.firstName} {user.lastName}
            </span>
            <span data-testid="result-email" className="email">
              {user.email}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
