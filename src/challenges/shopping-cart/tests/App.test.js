import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { cartReducer, initialCartState } from "./cartReducer";

const click = (testId) => fireEvent.click(screen.getByTestId(testId));
const text = (testId) => screen.getByTestId(testId).textContent;
const applyCoupon = (code) => {
  fireEvent.change(screen.getByTestId("coupon-input"), { target: { value: code } });
  click("apply-coupon");
};

const deepFreeze = (obj) => {
  Object.values(obj).forEach((v) => v && typeof v === "object" && deepFreeze(v));
  return Object.freeze(obj);
};

test("reducer adds a product, then increases its quantity, without mutating state", () => {
  const product = { id: 7, name: "Lamp", price: 12 };
  const empty = deepFreeze({ items: [] });

  const once = cartReducer(empty, { type: "add", product });
  expect(once).not.toBe(empty);
  expect(once.items).toEqual([{ id: 7, name: "Lamp", price: 12, quantity: 1 }]);

  deepFreeze(once);
  const twice = cartReducer(once, { type: "add", product });
  expect(twice.items).toEqual([{ id: 7, name: "Lamp", price: 12, quantity: 2 }]);
  expect(once.items[0].quantity).toBe(1);
});

test("reducer handles increment, decrement, remove and clear", () => {
  const state = deepFreeze({
    items: [
      { id: 1, name: "A", price: 1, quantity: 1 },
      { id: 2, name: "B", price: 2, quantity: 3 },
    ],
  });
  expect(cartReducer(state, { type: "increment", id: 1 }).items[0].quantity).toBe(2);
  expect(cartReducer(state, { type: "decrement", id: 2 }).items[1].quantity).toBe(2);
  expect(cartReducer(state, { type: "decrement", id: 1 }).items).toEqual([
    { id: 2, name: "B", price: 2, quantity: 3 },
  ]);
  expect(cartReducer(state, { type: "remove", id: 2 }).items).toEqual([
    { id: 1, name: "A", price: 1, quantity: 1 },
  ]);
  expect(cartReducer(state, { type: "clear" }).items).toEqual([]);
  expect(initialCartState.items).toEqual([]);
});

test("shows an empty cart message when nothing has been added", () => {
  render(<App />);
  expect(screen.getByTestId("cart-empty")).toHaveTextContent("Your cart is empty");
  expect(text("cart-count")).toBe("0");
  expect(text("cart-total")).toBe("$0.00");
});

test("adding the same product twice increases its quantity instead of duplicating it", () => {
  render(<App />);
  click("add-1");
  click("add-1");
  expect(screen.queryByTestId("cart-empty")).not.toBeInTheDocument();
  expect(screen.getAllByTestId("cart-item-1")).toHaveLength(1);
  expect(text("qty-1")).toBe("2");
});

test("cart count and total reflect every item and quantity", () => {
  render(<App />);
  click("add-1"); // 49.99
  click("add-2"); // 19.50
  click("increment-2"); // 19.50
  expect(text("cart-count")).toBe("3");
  expect(text("cart-total")).toBe("$88.99");
});

test("decrementing an item with quantity 1 removes it from the cart", () => {
  render(<App />);
  click("add-4");
  click("increment-4");
  click("decrement-4");
  expect(text("qty-4")).toBe("1");
  click("decrement-4");
  expect(screen.queryByTestId("cart-item-4")).not.toBeInTheDocument();
  expect(screen.getByTestId("cart-empty")).toBeInTheDocument();
});

test("remove button removes the item regardless of its quantity", () => {
  render(<App />);
  click("add-3");
  click("add-3");
  click("add-2");
  click("remove-3");
  expect(screen.queryByTestId("cart-item-3")).not.toBeInTheDocument();
  expect(text("cart-count")).toBe("1");
  expect(text("cart-total")).toBe("$19.50");
});

test("coupon SAVE10 (case-insensitive, trimmed) takes 10% off the total", () => {
  render(<App />);
  click("add-3"); // 189
  applyCoupon(" save10 ");
  expect(screen.queryByTestId("coupon-error")).not.toBeInTheDocument();
  expect(text("cart-discount")).toBe("-$18.90");
  expect(text("cart-total")).toBe("$170.10");
  click("add-4"); // 198.99 with 10% off
  expect(text("cart-total")).toBe("$179.09");
});

test("an invalid coupon shows an error and gives no discount", () => {
  render(<App />);
  click("add-1");
  applyCoupon("FREE");
  expect(screen.getByTestId("coupon-error")).toHaveTextContent("Invalid coupon");
  expect(screen.queryByTestId("cart-discount")).not.toBeInTheDocument();
  expect(text("cart-total")).toBe("$49.99");
});

test("clear cart empties the cart", () => {
  render(<App />);
  click("add-1");
  click("add-2");
  click("clear-cart");
  expect(screen.getByTestId("cart-empty")).toBeInTheDocument();
  expect(text("cart-count")).toBe("0");
  expect(text("cart-total")).toBe("$0.00");
});
