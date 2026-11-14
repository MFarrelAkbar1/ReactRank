# Todo Filter

Build a small todo app. Users can add todos, mark them complete, delete them, and filter the list.

## Requirements

1. **Add**: type in the input and click **Add**, or press **Enter**.
   - Trim the text before adding it (`"  buy milk  "` → `"buy milk"`).
   - Ignore input that is empty or only spaces.
   - Clear the input after a todo is added.
2. **Toggle**: every todo has a checkbox. Checking it marks the todo completed, and unchecking it marks it active again.
3. **Delete**: every todo has a delete button that removes it.
4. **Filter**: three buttons, **All**, **Active** and **Completed**, choose which todos are shown.
   - The filter that is currently selected has `aria-pressed="true"`. The others have `aria-pressed="false"`.
5. **Counter**: show how many todos are **not** completed: `"X items left"`, or `"1 item left"` when there is exactly one.
   - The counter does not depend on the filter.
6. Give every todo a stable, unique `key`. Do **not** use the array index.

> 💡 Store only the list of todos and the filter in state. Work out the visible todos and the counter from them while rendering (*derived state*).

## Required `data-testid`s

| Element | `data-testid` |
|---|---|
| Text input | `todo-input` |
| Add button | `add-button` |
| Each todo (`<li>`) | `todo-item` |
| Todo text (inside the item) | `todo-text` |
| Checkbox (inside the item) | `todo-toggle` |
| Delete button (inside the item) | `todo-delete` |
| Filter buttons | `filter-all`, `filter-active`, `filter-completed` |
| Counter | `items-left` |

## Example

```
Add "Learn React", Add "Walk dog"     → 2 items left
Toggle "Learn React"                  → 1 item left
Click Active                          → only "Walk dog" is shown
Click Completed                       → only "Learn React" is shown
```

## Notes
- Edit `App.js`. The tests render `<App />`.
