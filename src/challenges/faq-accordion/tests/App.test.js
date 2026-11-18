import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const headers = () => screen.getAllByTestId("accordion-header");
const panels = () => screen.queryAllByTestId("accordion-panel");

test("renders a header button for every question", () => {
  render(<App />);
  expect(headers()).toHaveLength(3);
  expect(headers()[0]).toHaveTextContent("What is React?");
});

test("all answers are closed initially", () => {
  render(<App />);
  expect(panels()).toHaveLength(0);
});

test("clicking a question opens its answer", () => {
  render(<App />);
  fireEvent.click(headers()[1]);
  expect(panels()).toHaveLength(1);
  expect(panels()[0]).toHaveTextContent("Data that a component remembers between renders.");
});

test("clicking an open question again closes it", () => {
  render(<App />);
  fireEvent.click(headers()[0]);
  fireEvent.click(headers()[0]);
  expect(panels()).toHaveLength(0);
});

test("opening another question closes the previous one", () => {
  render(<App />);
  fireEvent.click(headers()[0]);
  fireEvent.click(headers()[2]);
  expect(panels()).toHaveLength(1);
  expect(panels()[0]).toHaveTextContent("Inputs that a parent component passes to a child component.");
});

test("header buttons reflect the open state with aria-expanded", () => {
  render(<App />);
  headers().forEach((h) => expect(h).toHaveAttribute("aria-expanded", "false"));
  fireEvent.click(headers()[1]);
  expect(headers()[0]).toHaveAttribute("aria-expanded", "false");
  expect(headers()[1]).toHaveAttribute("aria-expanded", "true");
  expect(headers()[2]).toHaveAttribute("aria-expanded", "false");
});

test("collapse all is disabled when nothing is open", () => {
  render(<App />);
  expect(screen.getByTestId("collapse-all")).toBeDisabled();
  fireEvent.click(headers()[0]);
  expect(screen.getByTestId("collapse-all")).not.toBeDisabled();
});

test("collapse all closes the open answer", () => {
  render(<App />);
  fireEvent.click(headers()[2]);
  fireEvent.click(screen.getByTestId("collapse-all"));
  expect(panels()).toHaveLength(0);
  expect(screen.getByTestId("collapse-all")).toBeDisabled();
});
