import { useReducer, useState } from "react";
import { PRODUCTS } from "./data";
import { cartReducer, initialCartState } from "./cartReducer";
import "./styles.css";

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [couponInput, setCouponInput] = useState("");

  // TODO: total number of items (sum of quantities)
  const itemCount = 0;
  // TODO: subtotal, discount (10% with "SAVE10") and total
  const total = 0;

  return (
    <div className="shop">
      <section>
        <h2>Products</h2>
        <ul>
          {PRODUCTS.map((product) => (
            <li key={product.id}>
              <span>
                {product.name} <span className="muted">${product.price.toFixed(2)}</span>
              </span>
              <button
                data-testid={`add-${product.id}`}
                onClick={() => dispatch({ type: "add", product })}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>
          Cart (<span data-testid="cart-count">{itemCount}</span>)
        </h2>

        {/* TODO: show "Your cart is empty" (data-testid="cart-empty") when there are no items */}
        <ul>
          {cart.items.map((item) => (
            <li key={item.id} data-testid={`cart-item-${item.id}`}>
              <span>{item.name}</span>
              {/* TODO: quantity, +/- buttons and remove button */}
            </li>
          ))}
        </ul>

        <div className="summary">
          <div className="coupon">
            <input
              data-testid="coupon-input"
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button data-testid="apply-coupon">Apply</button>
          </div>
          {/* TODO: coupon error and discount line */}
          <strong>
            Total: <span data-testid="cart-total">${total.toFixed(2)}</span>
          </strong>
          <button data-testid="clear-cart">Clear cart</button>
        </div>
      </section>
    </div>
  );
}
