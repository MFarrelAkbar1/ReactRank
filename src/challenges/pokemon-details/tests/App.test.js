import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const POKEDEX = {
  1: {
    id: 1, num: "001", name: "Bulbasaur", type: ["Grass", "Poison"], height: "0.71 m", weight: "6.9 kg",
    weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
    next_evolution: [{ num: "002", name: "Ivysaur" }, { num: "003", name: "Venusaur" }],
  },
  2: {
    id: 2, num: "002", name: "Ivysaur", type: ["Grass", "Poison"], height: "0.99 m", weight: "13.0 kg",
    weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
    prev_evolution: [{ num: "001", name: "Bulbasaur" }],
    next_evolution: [{ num: "003", name: "Venusaur" }],
  },
  3: {
    id: 3, num: "003", name: "Venusaur", type: ["Grass", "Poison"], height: "2.01 m", weight: "100.0 kg",
    weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
    prev_evolution: [{ num: "001", name: "Bulbasaur" }, { num: "002", name: "Ivysaur" }],
  },
  4: {
    id: 4, num: "004", name: "Charmander", type: ["Fire"], height: "0.61 m", weight: "8.5 kg",
    weaknesses: ["Water", "Ground", "Rock"],
    next_evolution: [{ num: "005", name: "Charmeleon" }, { num: "006", name: "Charizard" }],
  },
  25: {
    id: 25, num: "025", name: "Pikachu", type: ["Electric"], height: "0.41 m", weight: "6.0 kg",
    weaknesses: ["Ground"],
    next_evolution: [{ num: "026", name: "Raichu" }],
  },
};

// In Sandpack's test runner `global`/`window` are not the same object as `globalThis`,
// and bare `fetch()` / `alert()` calls resolve through `globalThis`, so mock all of them.
const realFetch = globalThis.fetch;
const realAlert = globalThis.alert;
const setGlobal = (key, value) => {
  globalThis[key] = value;
  global[key] = value;
  window[key] = value;
};

// Create the mocks inside each test (not in beforeEach): Sandpack may register hooks
// from more than one evaluation of this file, which would swap the mocks under the test.
const setupMocks = () => {
  const fetchMock = jest.fn((url) => {
    const id = Number(String(url).split("id=")[1]);
    const body = POKEDEX[id] ? { data: POKEDEX[id] } : {};
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
  });
  const alertMock = jest.fn();
  setGlobal("fetch", fetchMock);
  setGlobal("alert", alertMock);
  return { fetchMock, alertMock };
};

afterEach(() => {
  setGlobal("fetch", realFetch);
  setGlobal("alert", realAlert);
});

const search = (id) => {
  fireEvent.change(screen.getByTestId("id-input"), { target: { value: String(id) } });
  fireEvent.click(screen.getByTestId("random-pokemon"));
};
const loadPokemon = async (id) => {
  search(id);
  await screen.findByText(POKEDEX[id].name);
};

test("renders the search form and no Pokemon card before searching", () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  expect(screen.getByTestId("id-input")).toHaveAttribute("type", "number");
  expect(screen.getByTestId("random-pokemon")).toBeInTheDocument();
  expect(screen.queryByTestId("pokemon-name")).not.toBeInTheDocument();
});

test("alerts and does not fetch when the ID is out of range", () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  search(0);
  search(152);
  search("");
  expect(alertMock).toHaveBeenCalledTimes(3);
  expect(alertMock).toHaveBeenCalledWith("Pokemon ID must be between 1 and 151");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("fetches the Pokemon from the correct URL", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(25);
  expect(alertMock).not.toHaveBeenCalled();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toBe("https://jsonmock.hackerrank.com/api/pokemon?id=25");
});

test("shows the Pokemon name and ID", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(4);
  expect(screen.getByTestId("pokemon-name")).toHaveTextContent("Charmander");
  expect(screen.getByTestId("pokemon-id")).toHaveTextContent(/^4$/);
});

test("shows every type with its own test id", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(1);
  const types = within(screen.getByTestId("pokemon-types")).getAllByRole("listitem");
  expect(types).toHaveLength(2);
  expect(screen.getByTestId("pokemon-type-Grass")).toHaveTextContent("Grass");
  expect(screen.getByTestId("pokemon-type-Poison")).toHaveTextContent("Poison");
});

test("shows height and weight exactly as returned by the API", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(25);
  expect(screen.getByTestId("pokemon-height")).toHaveTextContent("0.41 m");
  expect(screen.getByTestId("pokemon.weight")).toHaveTextContent("6.0 kg");
});

test("shows the list of weaknesses", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(4);
  expect(screen.getByTestId("pokemon-weeknesses")).toHaveTextContent("Weaknesses");
  const items = within(screen.getByTestId("weakness-list"))
    .getAllByRole("listitem")
    .map((li) => li.textContent);
  expect(items).toEqual(["Water", "Ground", "Rock"]);
});

test("Next Evolution loads the immediate next Pokemon", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(1);
  fireEvent.click(screen.getByTestId("pokemon-next"));
  expect(await screen.findByText("Ivysaur")).toBeInTheDocument();
  expect(fetchMock.mock.calls[1][0]).toBe("https://jsonmock.hackerrank.com/api/pokemon?id=2");
  expect(screen.getByTestId("pokemon-id")).toHaveTextContent(/^2$/);
  expect(screen.getByTestId("id-input")).toHaveValue(2);
});

test("Previous Evolution loads the immediate previous Pokemon", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  await loadPokemon(3);
  fireEvent.click(screen.getByTestId("pokemon-prev"));
  expect(await screen.findByText("Ivysaur")).toBeInTheDocument();
  expect(fetchMock.mock.calls[1][0]).toBe("https://jsonmock.hackerrank.com/api/pokemon?id=2");
});

test("disables evolution buttons when there is no evolution in that direction", async () => {
  const { fetchMock, alertMock } = setupMocks();
  render(<App />);
  expect(screen.getByTestId("pokemon-prev")).toBeDisabled();
  expect(screen.getByTestId("pokemon-next")).toBeDisabled();
  await loadPokemon(1);
  expect(screen.getByTestId("pokemon-prev")).toBeDisabled();
  expect(screen.getByTestId("pokemon-next")).toBeEnabled();
  await loadPokemon(3);
  expect(screen.getByTestId("pokemon-prev")).toBeEnabled();
  expect(screen.getByTestId("pokemon-next")).toBeDisabled();
});
