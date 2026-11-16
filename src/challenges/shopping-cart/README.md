# Shopping Cart

Build a small shopping cart. The cart state is managed with **`useReducer`**, and the reducer lives in its own file, `cartReducer.js`.

## Part 1: the reducer (`cartReducer.js`)

The state looks like `{ items: [{ id, name, price, quantity }] }`. Export `initialCartState` (`{ items: [] }`) and `cartReducer(state, action)`.

| Action | Behaviour |
|---|---|
| `{ type: "add", product }` | If the product is not in the cart, add it with `quantity: 1`. Otherwise increase its quantity by 1. |
| `{ type: "increment", id }` | Increase the item's quantity by 1. |
| `{ type: "decrement", id }` | Decrease the item's quantity by 1. **Remove** the item when it reaches 0. |
| `{ type: "remove", id }` | Remove the item, whatever its quantity. |
| `{ type: "clear" }` | Remove every item. |

The reducer must be **pure**: never mutate `state` or the item objects. Always return new objects. (The tests freeze the state they pass in.)

## Part 2: the UI (`App.js`)

| Element | `data-testid` | Notes |
|---|---|---|
| Add button for each product | `add-<id>` | Already done. |
| Cart row | `cart-item-<id>` | One row per product, never duplicated. |
| Quantity | `qty-<id>` | Just the number, e.g. `2`. |
| Increment / decrement | `increment-<id>` / `decrement-<id>` | |
| Remove | `remove-<id>` | |
| Empty message | `cart-empty` | Text `Your cart is empty`. Only rendered when the cart has no items. |
| Item count | `cart-count` | Sum of all quantities, e.g. `3`. |
| Total | `cart-total` | Formatted as `$88.99` (two decimals). |
| Coupon input / button | `coupon-input` / `apply-coupon` | |
| Coupon error | `coupon-error` | Text `Invalid coupon`. Not in the DOM unless the last applied code was invalid. |
| Discount line | `cart-discount` | Formatted as `-$18.90`. Only rendered while a valid coupon is applied. |
| Clear button | `clear-cart` | |

### Coupon rules

- The only valid code is `SAVE10`, which gives **10% off** the subtotal.
- Ignore case and surrounding spaces: `" save10 "` is valid.
- The discount is recalculated whenever the cart changes.
- Applying an invalid code shows the error and removes any discount.

## Example

```
Add Keyboard ($49.99), add Mouse ($19.50), + Mouse  → count 3, total $88.99
Remove Mouse                                         → count 1, total $49.99
Apply "save10"                                       → discount -$5.00, total $44.99
- Keyboard                                           → "Your cart is empty", total $0.00
```
