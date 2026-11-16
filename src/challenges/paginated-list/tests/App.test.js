import React from "react";
import { render, renderHook, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import usePagination from "./hooks/usePagination";

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);
const items = () => screen.getAllByTestId("item").map((el) => el.textContent);
const click = (testId) => fireEvent.click(screen.getByTestId(testId));

test("hook returns the first page and the number of pages", () => {
  const { result } = renderHook(() => usePagination(range(23), 5));
  expect(result.current.page).toBe(1);
  expect(result.current.totalPages).toBe(5);
  expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5]);
  expect(result.current.hasPrev).toBe(false);
  expect(result.current.hasNext).toBe(true);
});

test("hook moves with next/prev and stops at the first and last page", () => {
  const data = range(23);
  const { result } = renderHook(() => usePagination(data, 5));
  act(() => result.current.prev());
  expect(result.current.page).toBe(1);

  for (let i = 0; i < 6; i++) act(() => result.current.next());
  expect(result.current.page).toBe(5);
  expect(result.current.pageItems).toEqual([21, 22, 23]);
  expect(result.current.hasNext).toBe(false);

  act(() => result.current.prev());
  expect(result.current.page).toBe(4);
  expect(result.current.pageItems).toEqual([16, 17, 18, 19, 20]);
});

test("hook clamps goTo to a valid page", () => {
  const data = range(23);
  const { result } = renderHook(() => usePagination(data, 5));
  act(() => result.current.goTo(3));
  expect(result.current.pageItems).toEqual([11, 12, 13, 14, 15]);
  act(() => result.current.goTo(99));
  expect(result.current.page).toBe(5);
  act(() => result.current.goTo(-2));
  expect(result.current.page).toBe(1);
});

test("hook falls back to the last page when the items shrink", () => {
  const { result, rerender } = renderHook(({ list, size }) => usePagination(list, size), {
    initialProps: { list: range(23), size: 5 },
  });
  act(() => result.current.goTo(5));
  rerender({ list: range(7), size: 5 });
  expect(result.current.page).toBe(2);
  expect(result.current.totalPages).toBe(2);
  expect(result.current.pageItems).toEqual([6, 7]);
});

test("hook handles an empty list", () => {
  const { result } = renderHook(() => usePagination([], 5));
  expect(result.current.page).toBe(1);
  expect(result.current.totalPages).toBe(1);
  expect(result.current.pageItems).toEqual([]);
  expect(result.current.hasNext).toBe(false);
});

test("shows the first 5 countries and disables Prev on page 1", () => {
  render(<App />);
  expect(items()).toEqual(["Argentina", "Australia", "Brazil", "Canada", "Chile"]);
  expect(screen.getByTestId("page-info")).toHaveTextContent("Page 1 of 5");
  expect(screen.getByTestId("prev-button")).toBeDisabled();
  expect(screen.getByTestId("next-button")).toBeEnabled();
});

test("Next and Prev change the page and Next is disabled on the last page", () => {
  render(<App />);
  click("next-button");
  expect(items()[0]).toBe("Denmark");
  expect(screen.getByTestId("page-info")).toHaveTextContent("Page 2 of 5");
  for (let i = 0; i < 3; i++) click("next-button");
  expect(items()).toEqual(["Spain", "Sweden", "Vietnam"]);
  expect(screen.getByTestId("next-button")).toBeDisabled();
  click("prev-button");
  expect(screen.getByTestId("page-info")).toHaveTextContent("Page 4 of 5");
});

test("renders a button per page and marks the current one with aria-current", () => {
  render(<App />);
  expect(screen.getByTestId("page-5")).toBeInTheDocument();
  expect(screen.queryByTestId("page-6")).not.toBeInTheDocument();
  expect(screen.getByTestId("page-1")).toHaveAttribute("aria-current", "page");
  click("page-3");
  expect(items()[0]).toBe("India");
  expect(screen.getByTestId("page-3")).toHaveAttribute("aria-current", "page");
  expect(screen.getByTestId("page-1")).not.toHaveAttribute("aria-current");
});

test("changing the page size goes back to page 1", () => {
  render(<App />);
  click("page-4");
  fireEvent.change(screen.getByTestId("page-size"), { target: { value: "10" } });
  expect(screen.getByTestId("page-info")).toHaveTextContent("Page 1 of 3");
  expect(items()).toHaveLength(10);
  expect(items()[0]).toBe("Argentina");
});

test("searching filters the list and goes back to page 1", () => {
  render(<App />);
  click("page-2");
  fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  AN " } });
  expect(screen.getByTestId("page-info")).toHaveTextContent("Page 1 of 2");
  expect(items()).toEqual(["Canada", "Finland", "France", "Germany", "Japan"]);
  click("next-button");
  expect(items()).toEqual(["Netherlands"]);
});
