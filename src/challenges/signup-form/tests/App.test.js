import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const field = (name) => screen.getByTestId(name + "-input");
const type = (name, value) => fireEvent.change(field(name), { target: { value } });
const blur = (name) => fireEvent.blur(field(name));
const typeAndBlur = (name, value) => {
  type(name, value);
  blur(name);
};
const fillValid = () => {
  typeAndBlur("name", "Ada Lovelace");
  typeAndBlur("email", "ada@example.com");
  typeAndBlur("password", "analytical1");
  typeAndBlur("confirm", "analytical1");
};

test("renders all fields with submit disabled", () => {
  render(<App />);
  ["name", "email", "password", "confirm"].forEach((n) => expect(field(n)).toBeInTheDocument());
  expect(field("password")).toHaveAttribute("type", "password");
  expect(screen.getByTestId("submit-button")).toBeDisabled();
});

test("does not show errors before a field is touched", () => {
  render(<App />);
  type("email", "not-an-email");
  ["name", "email", "password", "confirm"].forEach((n) =>
    expect(screen.queryByTestId(n + "-error")).not.toBeInTheDocument(),
  );
});

test("shows name error after blurring an empty name", () => {
  render(<App />);
  typeAndBlur("name", "   ");
  expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
});

test("shows email error for an invalid email after blur", () => {
  render(<App />);
  typeAndBlur("email", "ada@");
  expect(screen.getByTestId("email-error")).toHaveTextContent("Please enter a valid email");
});

test("shows password error for a weak password", () => {
  render(<App />);
  typeAndBlur("password", "abcdefgh");
  expect(screen.getByTestId("password-error")).toHaveTextContent(
    "Password must be at least 8 characters and include a number",
  );
  type("password", "abc1");
  expect(screen.getByTestId("password-error")).toBeInTheDocument();
});

test("shows confirm error when passwords do not match", () => {
  render(<App />);
  typeAndBlur("password", "abcdefg1");
  typeAndBlur("confirm", "abcdefg2");
  expect(screen.getByTestId("confirm-error")).toHaveTextContent("Passwords do not match");
});

test("hides an error as soon as the field becomes valid", () => {
  render(<App />);
  typeAndBlur("email", "bad");
  expect(screen.getByTestId("email-error")).toBeInTheDocument();
  type("email", "good@example.com");
  expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
});

test("enables submit only when the whole form is valid", () => {
  render(<App />);
  typeAndBlur("name", "Ada");
  typeAndBlur("email", "ada@example.com");
  typeAndBlur("password", "analytical1");
  expect(screen.getByTestId("submit-button")).toBeDisabled();
  typeAndBlur("confirm", "analytical1");
  expect(screen.getByTestId("submit-button")).toBeEnabled();
  type("email", "broken");
  expect(screen.getByTestId("submit-button")).toBeDisabled();
});

test("shows a success message after submit", () => {
  render(<App />);
  fillValid();
  fireEvent.submit(screen.getByTestId("signup-form"));
  expect(screen.getByTestId("success-message")).toHaveTextContent("Welcome, Ada Lovelace!");
  expect(screen.queryByTestId("signup-form")).not.toBeInTheDocument();
});
