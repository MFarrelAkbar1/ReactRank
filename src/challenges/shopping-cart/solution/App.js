import { useReducer, useState } from "react";
import { PRODUCTS } from "./data";
import { cartReducer, initialCartState } from "./cartReducer";
import "./styles.css";

const COUPON_CODE = "SAVE10";
const COUPON_RATE = 0.1;

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * COUPON_RATE : 0;
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon");
    }
  };

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

        {cart.items.length === 0 ? (
          <p className="muted" data-testid="cart-empty">
            Your cart is empty
          </p>
        ) : (
          <ul>
            {cart.items.map((item) => (
              <li key={item.id} data-testid={`cart-item-${item.id}`}>
                <span>{item.name}</span>
                <span className="qty">
                  <button
                    data-testid={`decrement-${item.id}`}
                    onClick={() => dispatch({ type: "decrement", id: item.id })}
                  >
                    -
                  </button>
                  <span data-testid={`qty-${item.id}`}>{item.quantity}</span>
                  <button
                    data-testid={`increment-${item.id}`}
                    onClick={() => dispatch({ type: "increment", id: item.id })}
                  >
                    +
                  </button>
                  <button
                    data-testid={`remove-${item.id}`}
                    onClick={() => dispatch({ type: "remove", id: item.id })}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="summary">
          <div className="coupon">
            <input
              data-testid="coupon-input"
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button data-testid="apply-coupon" onClick={applyCoupon}>
              Apply
            </button>
          </div>
          {couponError && (
            <span className="error" data-testid="coupon-error">
              {couponError}
            </span>
          )}
          {couponApplied && <span data-testid="cart-discount">-${discount.toFixed(2)}</span>}
          <strong>
            Total: <span data-testid="cart-total">${total.toFixed(2)}</span>
          </strong>
          <button data-testid="clear-cart" onClick={() => dispatch({ type: "clear" })}>
            Clear cart
          </button>
        </div>
      </section>
    </div>
  );
}
