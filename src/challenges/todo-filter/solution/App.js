import { useState } from "react";
import "./styles.css";

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

let nextId = 1;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  const addTodo = () => {
    const title = text.trim();
    if (!title) return;
    setTodos((prev) => [...prev, { id: nextId++, title, completed: false }]);
    setText("");
  };

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  // Derived state: computed during render, not stored.
  const visibleTodos = todos.filter(FILTERS[filter]);
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <h1>Todos</h1>
      <div className="add-row">
        <input
          data-testid="todo-input"
          value={text}
          placeholder="What needs to be done?"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button data-testid="add-button" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {visibleTodos.map((todo) => (
          <li key={todo.id} data-testid="todo-item" className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              data-testid="todo-toggle"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span data-testid="todo-text">{todo.title}</span>
            <button data-testid="todo-delete" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="footer">
        <span data-testid="items-left">
          {remaining} {remaining === 1 ? "item" : "items"} left
        </span>
        <div className="filters">
          {["all", "active", "completed"].map((name) => (
            <button
              key={name}
              data-testid={"filter-" + name}
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
