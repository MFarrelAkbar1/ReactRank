import { useEffect, useState } from "react";
import "./styles.css";

export const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(USERS_URL)
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {
        // TODO: show an error message and a retry button
      });
  }, []);

  // TODO: loading indicator
  // TODO: search input that filters users by name

  return (
    <div className="app">
      <h1>User Directory</h1>
      <ul data-testid="user-list">
        {users.map((user) => (
          <li key={user.id} data-testid="user-item">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
