import { useState } from "react";
import "./styles.css";

export default function App() {
  // TODO: these two fields are not connected yet.
  // Store what was typed and in which scale, then calculate both fields from that.
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");

  // TODO: round converted values to at most 1 decimal place
  // TODO: show "Please enter a valid number" for invalid input

  return (
    <div className="converter">
      <h1>Temperature Converter</h1>

      <label>
        Celsius
        <input
          data-testid="celsius-input"
          type="text"
          inputMode="decimal"
          value={celsius}
          onChange={(e) => setCelsius(e.target.value)}
        />
      </label>

      <span className="equals">=</span>

      <label>
        Fahrenheit
        <input
          data-testid="fahrenheit-input"
          type="text"
          inputMode="decimal"
          value={fahrenheit}
          onChange={(e) => setFahrenheit(e.target.value)}
        />
      </label>
    </div>
  );
}
