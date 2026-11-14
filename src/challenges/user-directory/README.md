# User Directory Fetch

Load a list of users from an API and display it. Handle the **loading** and **error** states, and let the user search by name.

## API

```
GET https://jsonplaceholder.typicode.com/users
```

The URL is already exported from `App.js` as `USERS_URL`. The response is a JSON array:

```json
[
  { "id": 1, "name": "Leanne Graham", "email": "Sincere@april.biz" },
  { "id": 2, "name": "Ervin Howell", "email": "Shanna@melissa.tv" }
]
```

## Requirements

1. When the component mounts, call `fetch(USERS_URL)` **once**.
2. While the request is in progress, show a loading indicator (`data-testid="loading"`).
3. If the request **rejects** (network error) **or** the response is not OK (`response.ok === false`):
   - hide the loading indicator,
   - show `data-testid="error-message"` with the text `Failed to load users`,
   - show a **Retry** button (`data-testid="retry-button"`). Clicking it shows the loading indicator again and repeats the request.
4. When the request succeeds, show a list (`data-testid="user-list"`) with one `data-testid="user-item"` per user. Each item shows the user's **name** and **email**.
5. A search input (`data-testid="search-input"`) filters the list by **name**. The search is **case-insensitive** and matches any part of the name.
   - If no user matches, show `data-testid="empty-message"` with the text `No users found`.

## Notes
- Edit `App.js`. In the tests `fetch` is **mocked**, so no real network request is made. Always use the global `fetch`.
- `useEffect` + `async` function inside, or `.then()` chains, both work.
