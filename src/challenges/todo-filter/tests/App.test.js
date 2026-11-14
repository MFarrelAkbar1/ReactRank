import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const addTodo = (text) => {
  fireEvent.change(screen.getByTestId("todo-input"), { target: { value: text } });
  fireEvent.click(screen.getByTestId("add-button"));
};
const texts = () => screen.queryAllByTestId("todo-text").map((el) => el.textContent);
const itemByText = (text) =>
  screen.getAllByTestId("todo-item").find((li) => within(li).getByTestId("todo-text").textContent === text);

test("adds a new todo", () => {
  render(<App />);
  addTodo("Learn React");
  expect(texts()).toEqual(["Learn React"]);
});

test("adds a todo when Enter is pressed", () => {
  render(<App />);
  const input = screen.getByTestId("todo-input");
  fireEvent.change(input, { target: { value: "Press enter" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  expect(texts()).toEqual(["Press enter"]);
});

test("trims whitespace and clears the input after adding", () => {
  render(<App />);
  addTodo("   Buy milk   ");
  expect(texts()).toEqual(["Buy milk"]);
  expect(screen.getByTestId("todo-input")).toHaveValue("");
});

test("does not add empty or whitespace-only todos", () => {
  render(<App />);
  addTodo("");
  addTodo("     ");
  expect(screen.queryAllByTestId("todo-item")).toHaveLength(0);
});

test("toggles a todo as completed", () => {
  render(<App />);
  addTodo("Walk dog");
  const toggle = within(itemByText("Walk dog")).getByTestId("todo-toggle");
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  expect(within(itemByText("Walk dog")).getByTestId("todo-toggle")).toBeChecked();
});

test("deletes a todo", () => {
  render(<App />);
  addTodo("Keep me");
  addTodo("Delete me");
  fireEvent.click(within(itemByText("Delete me")).getByTestId("todo-delete"));
  expect(texts()).toEqual(["Keep me"]);
});

test("shows 'X items left' with correct pluralization", () => {
  render(<App />);
  addTodo("A");
  addTodo("B");
  expect(screen.getByTestId("items-left")).toHaveTextContent("2 items left");
  fireEvent.click(within(itemByText("A")).getByTestId("todo-toggle"));
  expect(screen.getByTestId("items-left")).toHaveTextContent("1 item left");
  fireEvent.click(within(itemByText("B")).getByTestId("todo-toggle"));
  expect(screen.getByTestId("items-left")).toHaveTextContent("0 items left");
});

test("filters active todos", () => {
  render(<App />);
  addTodo("Done task");
  addTodo("Open task");
  fireEvent.click(within(itemByText("Done task")).getByTestId("todo-toggle"));
  fireEvent.click(screen.getByTestId("filter-active"));
  expect(texts()).toEqual(["Open task"]);
  expect(screen.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "false");
});

test("filters completed todos", () => {
  render(<App />);
  addTodo("Done task");
  addTodo("Open task");
  fireEvent.click(within(itemByText("Done task")).getByTestId("todo-toggle"));
  fireEvent.click(screen.getByTestId("filter-completed"));
  expect(texts()).toEqual(["Done task"]);
});

test("'All' filter shows every todo again", () => {
  render(<App />);
  addTodo("One");
  addTodo("Two");
  fireEvent.click(within(itemByText("One")).getByTestId("todo-toggle"));
  fireEvent.click(screen.getByTestId("filter-completed"));
  fireEvent.click(screen.getByTestId("filter-all"));
  expect(texts()).toEqual(["One", "Two"]);
  expect(screen.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "true");
});
