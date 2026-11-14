import { useCallback, useEffect, useState } from "react";
import "./styles.css";

export const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [query, setQuery] = useState("");

  const loadUsers = useCallback(async (isCancelled = () => false) => {
    setStatus("loading");
    try {
      const res = await fetch(USERS_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (isCancelled()) return;
      setUsers(data);
      setStatus("success");
    } catch {
      if (!isCancelled()) setStatus("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadUsers(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadUsers]);

  const q = query.trim().toLowerCase();
  const visible = users.filter((u) => u.name.toLowerCase().includes(q));

  return (
    <div className="app">
      <h1>User Directory</h1>

      {status === "loading" && <p data-testid="loading">Loading users…</p>}

      {status === "error" && (
        <div>
          <p className="error" data-testid="error-message">
            Failed to load users
          </p>
          <button data-testid="retry-button" onClick={() => loadUsers()}>
            Retry
          </button>
        </div>
      )}

      {status === "success" && (
        <>
          <input
            data-testid="search-input"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {visible.length === 0 ? (
            <p data-testid="empty-message">No users found</p>
          ) : (
            <ul data-testid="user-list">
              {visible.map((user) => (
                <li key={user.id} data-testid="user-item">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
