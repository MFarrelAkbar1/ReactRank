import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const count = () => screen.getByTestId("count");
const setStep = (value) =>
  fireEvent.change(screen.getByTestId("step-input"), { target: { value: String(value) } });
const inc = (times = 1) => {
  for (let i = 0; i < times; i++) fireEvent.click(screen.getByTestId("increment"));
};
const dec = (times = 1) => {
  for (let i = 0; i < times; i++) fireEvent.click(screen.getByTestId("decrement"));
};

test("renders initial count of 0", () => {
  render(<App />);
  expect(count()).toHaveTextContent(/^0$/);
});

test("step input defaults to 1", () => {
  render(<App />);
  expect(screen.getByTestId("step-input")).toHaveValue(1);
});

test("increments count by 1 by default", () => {
  render(<App />);
  inc();
  expect(count()).toHaveTextContent(/^1$/);
});

test("increments count by step value", () => {
  render(<App />);
  setStep(5);
  inc(2);
  expect(count()).toHaveTextContent(/^10$/);
});

test("decrements count by step value", () => {
  render(<App />);
  setStep(4);
  inc(3);
  setStep(3);
  dec();
  expect(count()).toHaveTextContent(/^9$/);
});

test("never goes below 0", () => {
  render(<App />);
  setStep(2);
  inc(2);
  setStep(5);
  dec();
  expect(count()).toHaveTextContent(/^0$/);
});

test("clamps at max 100 and disables the increment button", () => {
  render(<App />);
  setStep(30);
  inc(4);
  expect(count()).toHaveTextContent(/^100$/);
  expect(screen.getByTestId("increment")).toBeDisabled();
});

test("disables the decrement button at 0", () => {
  render(<App />);
  expect(screen.getByTestId("decrement")).toBeDisabled();
  inc();
  expect(screen.getByTestId("decrement")).not.toBeDisabled();
});

test("treats an invalid step as 1", () => {
  render(<App />);
  setStep(4);
  inc();
  setStep("");
  inc();
  setStep(0);
  inc();
  expect(count()).toHaveTextContent(/^6$/);
});

test("reset sets the count back to 0 and keeps the step", () => {
  render(<App />);
  setStep(7);
  inc(2);
  fireEvent.click(screen.getByTestId("reset"));
  expect(count()).toHaveTextContent(/^0$/);
  inc();
  expect(count()).toHaveTextContent(/^7$/);
});
