import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const type = (value) =>
  fireEvent.change(screen.getByTestId("post-input"), { target: { value } });
const remaining = () => screen.getByTestId("remaining");
const postButton = () => screen.getByTestId("post-button");

test("shows 50 characters left initially", () => {
  render(<App />);
  expect(remaining()).toHaveTextContent(/^50$/);
});

test("updates the remaining count as the user types (spaces count too)", () => {
  render(<App />);
  type("hello world");
  expect(remaining()).toHaveTextContent(/^39$/);
});

test("adds the warning class when 10 or fewer characters are left", () => {
  render(<App />);
  type("a".repeat(39));
  expect(remaining()).not.toHaveClass("warning");
  type("a".repeat(40));
  expect(remaining()).toHaveClass("warning");
  expect(remaining()).not.toHaveClass("error");
});

test("shows a negative number and the error class when over the limit", () => {
  render(<App />);
  type("a".repeat(53));
  expect(remaining()).toHaveTextContent(/^-3$/);
  expect(remaining()).toHaveClass("error");
  expect(remaining()).not.toHaveClass("warning");
});

test("disables the Post button when the text is empty or only spaces", () => {
  render(<App />);
  expect(postButton()).toBeDisabled();
  type("    ");
  expect(postButton()).toBeDisabled();
  type("hi");
  expect(postButton()).not.toBeDisabled();
});

test("disables the Post button when the text is over the limit", () => {
  render(<App />);
  type("a".repeat(50));
  expect(postButton()).not.toBeDisabled();
  type("a".repeat(51));
  expect(postButton()).toBeDisabled();
});

test("posting adds the trimmed text and clears the textarea", () => {
  render(<App />);
  type("   my first post   ");
  fireEvent.click(postButton());
  const posts = screen.getAllByTestId("post");
  expect(posts).toHaveLength(1);
  expect(posts[0]).toHaveTextContent(/^my first post$/);
  expect(screen.getByTestId("post-input")).toHaveValue("");
  expect(remaining()).toHaveTextContent(/^50$/);
});

test("shows the newest post first", () => {
  render(<App />);
  type("first");
  fireEvent.click(postButton());
  type("second");
  fireEvent.click(postButton());
  const posts = screen.getAllByTestId("post");
  expect(posts).toHaveLength(2);
  expect(posts[0]).toHaveTextContent("second");
  expect(posts[1]).toHaveTextContent("first");
});
