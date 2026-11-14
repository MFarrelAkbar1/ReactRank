import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductTable from "./components/ProductTable";

const makeProducts = () =>
  Object.freeze(
    [
      { id: 1, name: "Keyboard", price: 49.99, rating: 4.5 },
      { id: 2, name: "Mouse", price: 19.99, rating: 4.7 },
      { id: 3, name: "Monitor", price: 199, rating: 4.5 },
      { id: 4, name: "Cable", price: 5.5, rating: 3.9 },
    ].map((p) => Object.freeze(p)),
  );

const names = () => screen.getAllByTestId("product-name").map((el) => el.textContent);

test("renders a row for every product in the original order", () => {
  render(<ProductTable products={makeProducts()} />);
  expect(screen.getByTestId("product-table")).toBeInTheDocument();
  expect(screen.getAllByTestId("product-row")).toHaveLength(4);
  expect(names()).toEqual(["Keyboard", "Mouse", "Monitor", "Cable"]);
});

test("formats price with a dollar sign and two decimals", () => {
  render(<ProductTable products={makeProducts()} />);
  const prices = screen.getAllByTestId("product-price").map((el) => el.textContent);
  expect(prices).toEqual(["$49.99", "$19.99", "$199.00", "$5.50"]);
});

test("sorts by price ascending on first click", () => {
  render(<ProductTable products={makeProducts()} />);
  fireEvent.click(screen.getByTestId("sort-price"));
  expect(names()).toEqual(["Cable", "Mouse", "Keyboard", "Monitor"]);
});

test("toggles price sort to descending on second click", () => {
  render(<ProductTable products={makeProducts()} />);
  fireEvent.click(screen.getByTestId("sort-price"));
  fireEvent.click(screen.getByTestId("sort-price"));
  expect(names()).toEqual(["Monitor", "Keyboard", "Mouse", "Cable"]);
  fireEvent.click(screen.getByTestId("sort-price"));
  expect(names()).toEqual(["Cable", "Mouse", "Keyboard", "Monitor"]);
});

test("sorts by rating highest first", () => {
  render(<ProductTable products={makeProducts()} />);
  fireEvent.click(screen.getByTestId("sort-rating"));
  expect(names()[0]).toBe("Mouse");
  expect(names()[3]).toBe("Cable");
});

test("keeps original order for products with equal rating", () => {
  render(<ProductTable products={makeProducts()} />);
  fireEvent.click(screen.getByTestId("sort-rating"));
  expect(names()).toEqual(["Mouse", "Keyboard", "Monitor", "Cable"]);
});

test("does not mutate the products prop", () => {
  const products = makeProducts();
  const before = products.map((p) => p.id);
  render(<ProductTable products={products} />);
  fireEvent.click(screen.getByTestId("sort-price"));
  fireEvent.click(screen.getByTestId("sort-price"));
  fireEvent.click(screen.getByTestId("sort-rating"));
  expect(products.map((p) => p.id)).toEqual(before);
  expect(names()).toEqual(["Mouse", "Keyboard", "Monitor", "Cable"]);
});

test("switching from price sort to rating sort and back works", () => {
  render(<ProductTable products={makeProducts()} />);
  fireEvent.click(screen.getByTestId("sort-price"));
  fireEvent.click(screen.getByTestId("sort-rating"));
  expect(names()).toEqual(["Mouse", "Keyboard", "Monitor", "Cable"]);
  fireEvent.click(screen.getByTestId("sort-price"));
  expect(names()).toEqual(["Cable", "Mouse", "Keyboard", "Monitor"]);
});
