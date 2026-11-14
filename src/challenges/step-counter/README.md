# Step Counter

Build a counter whose **step size** the user can choose. The counter must stay between **0** and **100**.

## Requirements

1. Show the current count. It starts at `0`.
2. Show a number input for the **step**. It starts at `1`.
   - If the step input is empty, not a number, or less than 1, use a step of `1`.
3. **+** adds the step to the count and **−** subtracts it.
4. The count can never go below `0` or above `100`. Clamp to the limit instead of skipping the click.
   - Example: count `90`, step `30`, click **+** → count becomes `100`.
5. The **+** button is **disabled** when the count is `100`. The **−** button is **disabled** when the count is `0`.
6. **Reset** sets the count back to `0`. The step stays the same.

## Required `data-testid`s

| Element | `data-testid` |
|---|---|
| Count display | `count` |
| Step input (`type="number"`) | `step-input` |
| + button | `increment` |
| − button | `decrement` |
| Reset button | `reset` |

## Example

| Action | Step | Count |
|---|---|---|
| (start) | 1 | 0 |
| click + | 1 | 1 |
| change step to 5, click + | 5 | 6 |
| click − | 5 | 1 |
| click − | 5 | 0 (clamped, − is now disabled) |

## Notes
- Edit `App.js`. The tests render `<App />`.
- The tests are hidden. You will see each test's name and whether it passed.
