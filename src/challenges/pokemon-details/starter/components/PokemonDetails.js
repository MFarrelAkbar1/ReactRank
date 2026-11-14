import { useState } from "react";
// Keep the ".js" extension: without it Sandpack confuses "./Pokemon" with "./PokemonDetails".
import { Pokemon } from "./Pokemon.js";

export const API_URL = "https://jsonmock.hackerrank.com/api/pokemon";

export function PokemonDetails() {
  // State is declared for you, but nothing is wired up yet.
  // eslint-disable-next-line no-unused-vars
  const [pokemon, setPokemon] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState("");

  // TODO: make the input controlled
  // TODO: validate the ID (1–151) and alert("Pokemon ID must be between 1 and 151")
  // TODO: fetch `${API_URL}?id=<id>` and store response.data
  // TODO: Previous / Next evolution buttons

  return (
    <div className="details-container">
      <div className="search-section">
        <h3 className="search-title">Search Pokemon</h3>
        <p className="search-subtitle">Enter a Pokemon ID (1-151) to get details</p>
        <div className="search-form">
          <input
            data-testid="id-input"
            value=""
            type="number"
            placeholder="Pokemon Id"
            className="search-input"
            readOnly
          />
          <button data-testid="random-pokemon" className="search-button">
            Get Pokemon
          </button>
        </div>
      </div>

      <Pokemon pokemon={pokemon} />

      <div className="evolution-controls">
        <button data-testid="pokemon-prev" className="evolution-button">
          ← Previous Evolution
        </button>
        <button data-testid="pokemon-next" className="evolution-button">
          Next Evolution →
        </button>
      </div>
    </div>
  );
}
