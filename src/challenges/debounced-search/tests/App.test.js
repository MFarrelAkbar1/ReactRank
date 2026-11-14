import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App, { SEARCH_URL } from "./App";

const USERS = {
  joh: [
    { id: 1, firstName: "Emily", lastName: "Johnson", email: "emily@example.com" },
    { id: 2, firstName: "John", lastName: "Doe", email: "john@example.com" },
    { id: 3, firstName: "Michael", lastName: "Johnson", email: "michael@example.com" },
  ],
  ada: [{ id: 4, firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" }],
};

// In Sandpack's test runner `global`/`window` are not the same object as `globalThis`,
// and a bare `fetch()` call resolves through `globalThis`, so mock all of them.
const realFetch = globalThis.fetch;
const setFetch = (fn) => {
  globalThis.fetch = fn;
  global.fetch = fn;
  window.fetch = fn;
};
afterEach(() => setFetch(realFetch));

const respond = (users, ok = true) =>
  Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve({ users, total: users.length }) });
const queryOf = (url) => decodeURIComponent(String(url).split("?q=")[1] || "");

/** Mock created inside each test (see CONTRIBUTING-CHALLENGES.md). Answers from USERS by query. */
const mockSearch = () => {
  const fn = jest.fn((url) => respond(USERS[queryOf(url).toLowerCase()] || []));
  setFetch(fn);
  return fn;
};

/** Mock whose responses are resolved manually by the test. */
const mockDeferred = () => {
  const pending = [];
  const fn = jest.fn(
    (url, options) =>
      new Promise((resolve) => {
        pending.push({ query: queryOf(url), options, resolve: (users) => resolve(respond(users)) });
      }),
  );
  setFetch(fn);
  return { fn, pending };
};

const wait = (ms) => act(() => new Promise((r) => setTimeout(r, ms)));
const type = (value) => fireEvent.change(screen.getByTestId("search-input"), { target: { value } });
const names = () => screen.queryAllByTestId("result-name").map((el) => el.textContent);

test("does not call the API while the user is still typing", async () => {
  const fetchMock = mockSearch();
  render(<App />);
  type("j");
  await wait(100);
  type("jo");
  await wait(100);
  type("joh");
  await wait(100);
  expect(fetchMock).not.toHaveBeenCalled();
});

test("calls the API once, 300ms after typing stops, with the trimmed and encoded query", async () => {
  const fetchMock = mockSearch();
  render(<App />);
  type("a");
  type("ad");
  type("  ada lovelace ");
  await wait(450);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toBe(SEARCH_URL + "?q=ada%20lovelace");
});

test("does not call the API for an empty query and clears previous results", async () => {
  const fetchMock = mockSearch();
  render(<App />);
  type("   ");
  await wait(450);
  expect(fetchMock).not.toHaveBeenCalled();
  type("ada");
  await screen.findByTestId("result-list");
  type("  ");
  await wait(450);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(screen.queryAllByTestId("result-item")).toHaveLength(0);
  expect(screen.queryByTestId("no-results")).not.toBeInTheDocument();
});

test("shows a loading indicator while the request is pending", async () => {
  const { pending } = mockDeferred();
  render(<App />);
  type("joh");
  await wait(450);
  expect(screen.getByTestId("loading")).toBeInTheDocument();
  await act(async () => pending[0].resolve(USERS.joh));
  expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
});

test("renders each user's full name and email with a result count", async () => {
  mockSearch();
  render(<App />);
  type("joh");
  const items = await screen.findAllByTestId("result-item");
  expect(items).toHaveLength(3);
  expect(names()).toEqual(["Emily Johnson", "John Doe", "Michael Johnson"]);
  expect(within(items[1]).getByTestId("result-email")).toHaveTextContent("john@example.com");
  expect(screen.getByTestId("result-count")).toHaveTextContent("3 results");
  type("ada");
  expect(await screen.findByText("1 result")).toBeInTheDocument();
});

test("shows a 'no users found' message when there are no results", async () => {
  mockSearch();
  render(<App />);
  type(" zzz ");
  expect(await screen.findByTestId("no-results")).toHaveTextContent('No users found for "zzz"');
  expect(screen.queryAllByTestId("result-item")).toHaveLength(0);
});

test("shows an error message when the request fails or the response is not ok", async () => {
  const fetchMock = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(new Error("Network down")))
    .mockImplementationOnce(() => respond([], false));
  setFetch(fetchMock);
  render(<App />);
  type("joh");
  expect(await screen.findByTestId("error-message")).toHaveTextContent("Something went wrong. Please try again.");
  type("ada");
  await wait(450);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId("error-message")).toBeInTheDocument();
  expect(screen.queryByTestId("result-list")).not.toBeInTheDocument();
});

test("ignores a stale response that arrives after a newer one", async () => {
  const { pending } = mockDeferred();
  render(<App />);
  type("joh");
  await wait(450);
  type("ada");
  await wait(450);
  expect(pending.map((p) => p.query)).toEqual(["joh", "ada"]);
  // The newer request finishes first, then the old one comes back late.
  await act(async () => pending[1].resolve(USERS.ada));
  await act(async () => pending[0].resolve(USERS.joh));
  expect(names()).toEqual(["Ada Lovelace"]);
});

test("aborts the previous request when the query changes", async () => {
  const { pending } = mockDeferred();
  render(<App />);
  type("joh");
  await wait(450);
  expect(pending[0].options && pending[0].options.signal).toBeTruthy();
  expect(pending[0].options.signal.aborted).toBe(false);
  type("ada");
  await wait(450);
  expect(pending[0].options.signal.aborted).toBe(true);
  expect(pending[1].options.signal.aborted).toBe(false);
  expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
});

test("highlights the matching part of each name", async () => {
  mockSearch();
  render(<App />);
  type("JOH");
  const items = await screen.findAllByTestId("result-item");
  const marks = items.map((li) => {
    const mark = within(li).getByTestId("result-name").querySelector("mark");
    return mark && mark.textContent;
  });
  expect(marks).toEqual(["Joh", "Joh", "Joh"]);
  expect(within(items[0]).getByTestId("result-name")).toHaveTextContent("Emily Johnson");
});
