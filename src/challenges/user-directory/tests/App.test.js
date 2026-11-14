import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App, { USERS_URL } from "./App";

const USERS = [
  { id: 1, name: "Leanne Graham", email: "leanne@example.com" },
  { id: 2, name: "Ervin Howell", email: "ervin@example.com" },
  { id: 3, name: "Clementine Bauch", email: "clementine@example.com" },
];

const okResponse = (data) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });
const badResponse = () => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({ message: "boom" }) });

// In Sandpack's test runner `global`/`window` are not the same object as `globalThis`,
// and a bare `fetch(...)` call resolves through `globalThis`, so mock all of them.
const realFetch = globalThis.fetch;
const setFetch = (fn) => {
  globalThis.fetch = fn;
  global.fetch = fn;
  window.fetch = fn;
};
const mockFetch = (fn) => {
  setFetch(fn);
  return fn;
};

afterEach(() => setFetch(realFetch));

test("shows a loading indicator while fetching", async () => {
  let resolve;
  mockFetch(jest.fn(() => new Promise((r) => (resolve = r))));
  render(<App />);
  expect(screen.getByTestId("loading")).toBeInTheDocument();
  resolve({ ok: true, status: 200, json: () => Promise.resolve(USERS) });
  await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
});

test("fetches users from the correct URL", async () => {
  const fetchMock = mockFetch(jest.fn(() => okResponse(USERS)));
  render(<App />);
  await screen.findAllByTestId("user-item");
  expect(USERS_URL).toBe("https://jsonplaceholder.typicode.com/users");
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toBe(USERS_URL);
});

test("renders the user list after loading", async () => {
  mockFetch(jest.fn(() => okResponse(USERS)));
  render(<App />);
  const items = await screen.findAllByTestId("user-item");
  expect(items).toHaveLength(3);
  expect(items[0]).toHaveTextContent("Leanne Graham");
  expect(items[0]).toHaveTextContent("leanne@example.com");
  expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
});

test("shows an error message when the request fails", async () => {
  mockFetch(jest.fn(() => Promise.reject(new Error("Network down"))));
  render(<App />);
  expect(await screen.findByTestId("error-message")).toHaveTextContent("Failed to load users");
  expect(screen.getByTestId("retry-button")).toBeInTheDocument();
  expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
});

test("treats a non-ok response as an error", async () => {
  mockFetch(jest.fn(() => badResponse()));
  render(<App />);
  expect(await screen.findByTestId("error-message")).toHaveTextContent("Failed to load users");
  expect(screen.queryAllByTestId("user-item")).toHaveLength(0);
});

test("retry button fetches again and shows users", async () => {
  const fetchMock = mockFetch(jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(new Error("Network down")))
    .mockImplementationOnce(() => okResponse(USERS)));
  render(<App />);
  fireEvent.click(await screen.findByTestId("retry-button"));
  expect(screen.getByTestId("loading")).toBeInTheDocument();
  expect(await screen.findAllByTestId("user-item")).toHaveLength(3);
  expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test("filters users by name (case-insensitive)", async () => {
  mockFetch(jest.fn(() => okResponse(USERS)));
  render(<App />);
  await screen.findAllByTestId("user-item");
  fireEvent.change(screen.getByTestId("search-input"), { target: { value: "ERVIN" } });
  const items = screen.getAllByTestId("user-item");
  expect(items).toHaveLength(1);
  expect(items[0]).toHaveTextContent("Ervin Howell");
  fireEvent.change(screen.getByTestId("search-input"), { target: { value: "nE" } });
  expect(screen.getAllByTestId("user-item")).toHaveLength(2);
});

test("shows 'No users found' when the search has no matches", async () => {
  mockFetch(jest.fn(() => okResponse(USERS)));
  render(<App />);
  await screen.findAllByTestId("user-item");
  fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });
  expect(screen.getByTestId("empty-message")).toHaveTextContent("No users found");
  expect(screen.queryAllByTestId("user-item")).toHaveLength(0);
});
