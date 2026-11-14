import { useState } from "react";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const addTodo = () => {
    // TODO: trim the text, ignore empty input and clear the input afterwards
    setTodos([...todos, text]);
  };

  // TODO: toggle, delete, filters (All / Active / Completed) and "X items left"

  return (
    <div className="app">
      <h1>Todos</h1>
      <div className="add-row">
        <input
          data-testid="todo-input"
          value={text}
          placeholder="What needs to be done?"
          onChange={(e) => setText(e.target.value)}
        />
        <button data-testid="add-button" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} data-testid="todo-item">
            <span data-testid="todo-text">{todo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
