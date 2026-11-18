import { useState } from "react";
import "./styles.css";

const toFahrenheit = (c) => (c * 9) / 5 + 32;
const toCelsius = (f) => ((f - 32) * 5) / 9;
const round1 = (n) => String(Math.round(n * 10) / 10);

function parse(text) {
  if (text.trim() === "") return { empty: true };
  const n = Number(text);
  return Number.isFinite(n) ? { value: n } : { invalid: true };
}

export default function App() {
  const [input, setInput] = useState({ scale: "c", text: "" });

  const parsed = parse(input.text);
  const convert = input.scale === "c" ? toFahrenheit : toCelsius;
  const other = parsed.value !== undefined ? round1(convert(parsed.value)) : "";

  const celsius = input.scale === "c" ? input.text : other;
  const fahrenheit = input.scale === "f" ? input.text : other;

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
          onChange={(e) => setInput({ scale: "c", text: e.target.value })}
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
          onChange={(e) => setInput({ scale: "f", text: e.target.value })}
        />
      </label>

      {parsed.invalid && (
        <p className="error" data-testid="error">
          Please enter a valid number
        </p>
      )}
    </div>
  );
}
