# Product Sorter

Finish the `ProductTable` component. It receives a list of products **as props** and lets the user sort them by price or rating, **without mutating the props**.

## Component

```jsx
<ProductTable products={[{ id, name, price, rating }, ...]} />
```

`components/ProductTable.js` must **default-export** `ProductTable`. `App.js` already renders it with sample data from `data.js`.

## Requirements

1. Render a table (`data-testid="product-table"`) with one row (`data-testid="product-row"`) per product. Each row has these cells:
   - `data-testid="product-name"`: the name
   - `data-testid="product-price"`: the price as dollars with two decimals, e.g. `12.5` → `$12.50`
   - `data-testid="product-rating"`: the rating number as given
2. At first, rows appear in the **same order as the `products` prop**.
3. **Sort by price** (`data-testid="sort-price"`):
   - first click → price **ascending** (cheapest first),
   - next click → **descending**, then ascending again, and so on.
4. **Sort by rating** (`data-testid="sort-rating"`): **highest rating first**. Products with the same rating keep their original order.
5. Switching between the two sorts works at any time.
6. ⚠️ **Never mutate the `products` prop.** `Array.prototype.sort()` sorts in place, so copy the array first. The tests pass a **frozen** array and check that it is unchanged.

## Example

| Product | Price | Rating |
|---|---|---|
| Keyboard | 49.99 | 4.5 |
| Mouse | 19.99 | 4.7 |
| Monitor | 199 | 4.5 |

- Sort by price (1st click): Mouse, Keyboard, Monitor
- Sort by price (2nd click): Monitor, Keyboard, Mouse
- Sort by rating: Mouse, Keyboard, Monitor (Keyboard stays before Monitor because both are rated 4.5)
