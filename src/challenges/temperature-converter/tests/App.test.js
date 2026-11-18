import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const celsius = () => screen.getByTestId("celsius-input");
const fahrenheit = () => screen.getByTestId("fahrenheit-input");
const typeC = (value) => fireEvent.change(celsius(), { target: { value } });
const typeF = (value) => fireEvent.change(fahrenheit(), { target: { value } });

test("both fields start empty", () => {
  render(<App />);
  expect(celsius()).toHaveValue("");
  expect(fahrenheit()).toHaveValue("");
});

test("converts Celsius to Fahrenheit", () => {
  render(<App />);
  typeC("100");
  expect(fahrenheit()).toHaveValue("212");
});

test("converts Fahrenheit to Celsius", () => {
  render(<App />);
  typeF("32");
  expect(celsius()).toHaveValue("0");
});

test("rounds the converted value to 1 decimal place", () => {
  render(<App />);
  typeC("37.5");
  expect(fahrenheit()).toHaveValue("99.5");
  typeF("100");
  expect(celsius()).toHaveValue("37.8");
});

test("handles negative temperatures", () => {
  render(<App />);
  typeC("-40");
  expect(fahrenheit()).toHaveValue("-40");
  typeF("-4");
  expect(celsius()).toHaveValue("-20");
});

test("keeps exactly what the user typed in the edited field", () => {
  render(<App />);
  typeC("25.0");
  expect(celsius()).toHaveValue("25.0");
  expect(fahrenheit()).toHaveValue("77");
});

test("clearing a field clears the other field", () => {
  render(<App />);
  typeC("10");
  typeC("");
  expect(fahrenheit()).toHaveValue("");
});

test("shows an error for invalid input and leaves the other field empty", () => {
  render(<App />);
  expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  typeF("abc");
  expect(screen.getByTestId("error")).toHaveTextContent("Please enter a valid number");
  expect(celsius()).toHaveValue("");
  typeF("50");
  expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  expect(celsius()).toHaveValue("10");
});
