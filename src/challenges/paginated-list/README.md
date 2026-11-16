# Paginated List

Split a list of countries into pages. The pagination logic lives in a reusable **custom hook**, `usePagination`, in `hooks/usePagination.js`.

## Part 1: `usePagination(items, pageSize)`

The hook is the default export. It returns an object:

| Field | Description |
|---|---|
| `page` | Current page, **1-based**. |
| `totalPages` | `ceil(items.length / pageSize)`, but **at least 1** (an empty list has 1 page). |
| `pageItems` | The items on the current page. |
| `hasPrev` / `hasNext` | Whether there is a previous / next page. |
| `prev()` / `next()` | Move one page. Does nothing on the first / last page. |
| `goTo(n)` | Go to page `n`, clamped between `1` and `totalPages`. |

If `items` or `pageSize` change and the current page **no longer exists**, the hook must return the **last page that exists**. Example: you are on page 5 of 23 items, and the list shrinks to 7 items → the hook returns page 2 with `[item6, item7]`.

> Tip: you don't need `useEffect` for this. The page you show can be **derived** from the stored page and `totalPages`.

## Part 2: the UI (`App.js`)

| Element | `data-testid` | Notes |
|---|---|---|
| Search input | `search-input` | Case-insensitive "contains" match. Surrounding spaces are ignored. Already done. |
| Page size select | `page-size` | `5` (default) or `10`. Already done. |
| Each visible country | `item` | |
| Prev / Next buttons | `prev-button` / `next-button` | Disabled when there is no previous / next page. |
| Page number buttons | `page-1`, `page-2`, ... | One per page. Clicking one goes to that page. The current page's button has `aria-current="page"`, and the others have no `aria-current` attribute. |
| Page info | `page-info` | Text `Page <page> of <totalPages>`. |

Changing the **search text** or the **page size** goes back to **page 1**.

## Example

```
Start                    → Argentina … Chile, "Page 1 of 5", Prev disabled
Next ×4                  → Spain, Sweden, Vietnam, Next disabled
Click page 3             → starts with India
Page size 10             → "Page 1 of 3"
Search "an"              → Canada, Finland, France, Germany, Japan, "Page 1 of 2"
```
