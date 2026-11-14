import { useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  // TODO: store the step in state and use it
  // TODO: clamp the count between 0 and 100 and disable the buttons at the limits
  // TODO: add a reset button

  return (
    <div className="counter">
      <h1>Step Counter</h1>
      <p className="count" data-testid="count">{count}</p>

      <label>
        Step:{" "}
        <input data-testid="step-input" type="number" defaultValue={1} />
      </label>

      <div className="buttons">
        <button data-testid="decrement" onClick={() => setCount(count - 1)}>
          −
        </button>
        <button data-testid="increment" onClick={() => setCount(count + 1)}>
          +
        </button>
      </div>
    </div>
  );
}
