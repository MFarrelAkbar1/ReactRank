import { useState } from "react";
import "./styles.css";

const MIN = 0;
const MAX = 100;

export default function App() {
  const [count, setCount] = useState(0);
  const [stepText, setStepText] = useState("1");

  const parsed = parseInt(stepText, 10);
  const step = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;

  const clamp = (n) => Math.min(MAX, Math.max(MIN, n));

  return (
    <div className="counter">
      <h1>Step Counter</h1>
      <p className="count" data-testid="count">{count}</p>

      <label>
        Step:{" "}
        <input
          data-testid="step-input"
          type="number"
          min="1"
          value={stepText}
          onChange={(e) => setStepText(e.target.value)}
        />
      </label>

      <div className="buttons">
        <button
          data-testid="decrement"
          disabled={count <= MIN}
          onClick={() => setCount((c) => clamp(c - step))}
        >
          −
        </button>
        <button
          data-testid="increment"
          disabled={count >= MAX}
          onClick={() => setCount((c) => clamp(c + step))}
        >
          +
        </button>
        <button data-testid="reset" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
