# Temperature Converter

Build a two-way converter between **Celsius** and **Fahrenheit**. Typing in either field updates the other one.

## Requirements

1. Show two text inputs, **Celsius** and **Fahrenheit**. Both start empty.
2. Typing a number in **Celsius** fills **Fahrenheit** with `C × 9 / 5 + 32`.
3. Typing a number in **Fahrenheit** fills **Celsius** with `(F − 32) × 5 / 9`.
4. Round the **converted** value to at most **1 decimal place**, without trailing zeros.
   - `37.5 °C` → `99.5`, `100 °F` → `37.8`, `100 °C` → `212` (not `212.0`).
5. The field the user is typing in shows **exactly what they typed** (e.g. `25.0` stays `25.0`).
6. If the field the user typed in is **empty**, the other field is empty too.
7. If the user types something that is **not a number** (e.g. `abc`):
   - show an error message: `Please enter a valid number`
   - leave the other field empty.
   - The error is not shown when the input is empty or valid.

> 💡 Don't keep two separate temperatures in state that you try to keep in sync. Store **what was typed** and **which scale it was typed in**, then calculate both fields from that.

## Required `data-testid`s

| Element | `data-testid` |
|---|---|
| Celsius input | `celsius-input` |
| Fahrenheit input | `fahrenheit-input` |
| Error message | `error` |

## Example

| Typed in | Value | Celsius shows | Fahrenheit shows |
|---|---|---|---|
| Celsius | `100` | `100` | `212` |
| Fahrenheit | `32` | `0` | `32` |
| Celsius | `-40` | `-40` | `-40` |
| Fahrenheit | `abc` | *(empty)* | `abc` + error |

## Notes
- Edit `App.js`. The tests render `<App />`.
- The tests are hidden. You will see each test's name and whether it passed.
