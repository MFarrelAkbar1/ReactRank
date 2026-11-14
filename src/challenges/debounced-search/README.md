# Debounced Search

Build a live user search that feels fast **and** stays correct. The current version calls the API on **every keystroke** and can show results for an **old** query when responses arrive out of order. Fix both problems and handle every state of the request.

## API

```
GET https://dummyjson.com/users/search?q=<query>
```

The URL is exported from `App.js` as `SEARCH_URL`. Response:

```json
{
  "users": [
    { "id": 1, "firstName": "Emily", "lastName": "Johnson", "email": "emily.johnson@x.dummyjson.com" }
  ],
  "total": 1
}
```

## Requirements

### 1. Debounce (300 ms)
- Wait until the user has **stopped typing for 300 ms** (`DEBOUNCE_MS`) before calling the API.
- Typing `r` → `re` → `rea` quickly must result in **one** request, for `rea`.

### 2. Query handling
- **Trim** the query and **URL-encode** it: `"  ada lovelace "` → `?q=ada%20lovelace`.
- If the trimmed query is **empty**, do **not** call the API, and clear any previous results and messages.

### 3. Request states

| State | What to render |
|---|---|
| Waiting for the response | `data-testid="loading"` |
| Success with users | `data-testid="result-count"` (`"3 results"` / `"1 result"`) and a `data-testid="result-list"` with one `data-testid="result-item"` per user |
| Success with no users | `data-testid="no-results"` with the text `No users found for "<query>"` (trimmed query) |
| Request rejected **or** `response.ok === false` | `data-testid="error-message"` with the text `Something went wrong. Please try again.` |

Each `result-item` contains:
- `data-testid="result-name"`: `firstName lastName`
- `data-testid="result-email"`: the email

### 4. Race conditions ⚠️
- Only the response for the **latest** query may be shown. If an older request finishes after a newer one, **ignore** it.
- When a new request starts, **abort** the previous one with an `AbortController`. Pass the signal to fetch: `fetch(url, { signal })`.
- An aborted request must **not** show the error message.

### 5. Highlight
- In each `result-name`, wrap the **first** part that matches the query (case-insensitive) in a `<mark>` element.
  - Query `joh` + name `Emily Johnson` → `Emily <mark>Joh</mark>nson`. Keep the name's original casing.

## Hints
- A `useDebouncedValue(value, delay)` custom hook with `setTimeout` plus `clearTimeout` in the cleanup is a clean way to do the debounce.
- Clean up in `useEffect` (abort the request, set an `ignore` flag) to avoid race conditions.
- In the tests `fetch` is **mocked**. Call the global `fetch(url, { signal })`.
