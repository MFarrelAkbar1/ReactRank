import { useEffect, useState } from "react";
import "./styles.css";

export const SEARCH_URL = "https://dummyjson.com/users/search";
export const DEBOUNCE_MS = 300;

/** Returns `value` only after it has stopped changing for `delay` ms. */
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Wraps the first case-insensitive match of `query` in <mark>. */
function Highlight({ text, query }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);
  // status: "idle" | "loading" | "success" | "error"
  const [state, setState] = useState({ status: "idle", users: [], query: "" });

  useEffect(() => {
    if (!debouncedQuery) {
      setState({ status: "idle", users: [], query: "" });
      return;
    }

    const controller = new AbortController();
    let ignore = false;
    setState((s) => ({ ...s, status: "loading" }));

    fetch(`${SEARCH_URL}?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        if (ignore) return; // a newer query has started — drop this stale response
        setState({ status: "success", users: data.users || [], query: debouncedQuery });
      })
      .catch((err) => {
        if (ignore || err.name === "AbortError") return;
        setState({ status: "error", users: [], query: debouncedQuery });
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [debouncedQuery]);

  const { status, users } = state;

  return (
    <div className="app">
      <h1>User Search</h1>
      <input
        data-testid="search-input"
        className="search"
        placeholder="Search users…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {status === "loading" && (
        <p className="status" data-testid="loading">
          Searching…
        </p>
      )}

      {status === "error" && (
        <p className="status error" data-testid="error-message">
          Something went wrong. Please try again.
        </p>
      )}

      {status === "success" && users.length === 0 && (
        <p className="status" data-testid="no-results">
          No users found for "{state.query}"
        </p>
      )}

      {status === "success" && users.length > 0 && (
        <>
          <p className="status" data-testid="result-count">
            {users.length} {users.length === 1 ? "result" : "results"}
          </p>
          <ul data-testid="result-list" className="results">
            {users.map((user) => (
              <li key={user.id} data-testid="result-item">
                <span data-testid="result-name">
                  <Highlight text={`${user.firstName} ${user.lastName}`} query={state.query} />
                </span>
                <span data-testid="result-email" className="email">
                  {user.email}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
