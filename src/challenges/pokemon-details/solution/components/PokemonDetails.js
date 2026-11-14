import { useState } from "react";
// Keep the ".js" extension: without it Sandpack confuses "./Pokemon" with "./PokemonDetails".
import { Pokemon } from "./Pokemon.js";

export const API_URL = "https://jsonmock.hackerrank.com/api/pokemon";

const MIN_ID = 1;
const MAX_ID = 151;

export function PokemonDetails() {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState("");

  const fetchPokemon = async (pokemonId) => {
    const response = await fetch(`${API_URL}?id=${pokemonId}`);
    const json = await response.json();
    // `data` is a single object (not an array). Unknown IDs return {}.
    if (json && json.data) {
      setPokemon(json.data);
      setId(json.data.id);
    }
  };

  const handleSearch = () => {
    const pokemonId = Number(id);
    if (id === "" || !Number.isInteger(pokemonId) || pokemonId < MIN_ID || pokemonId > MAX_ID) {
      alert("Pokemon ID must be between 1 and 151");
      return;
    }
    fetchPokemon(pokemonId);
  };

  const prev = pokemon?.prev_evolution?.length ? pokemon.prev_evolution[pokemon.prev_evolution.length - 1] : null;
  const next = pokemon?.next_evolution?.length ? pokemon.next_evolution[0] : null;

  // "002" -> 2
  const loadEvolution = (evolution) => fetchPokemon(parseInt(evolution.num, 10));

  return (
    <div className="details-container">
      <div className="search-section">
        <h3 className="search-title">Search Pokemon</h3>
        <p className="search-subtitle">Enter a Pokemon ID (1-151) to get details</p>
        <div className="search-form">
          <input
            data-testid="id-input"
            value={id}
            type="number"
            min={MIN_ID}
            max={MAX_ID}
            placeholder="Pokemon Id"
            className="search-input"
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button data-testid="random-pokemon" className="search-button" onClick={handleSearch}>
            Get Pokemon
          </button>
        </div>
      </div>

      <Pokemon pokemon={pokemon} />

      <div className="evolution-controls">
        <button
          data-testid="pokemon-prev"
          className="evolution-button"
          disabled={!prev}
          onClick={() => prev && loadEvolution(prev)}
        >
          ← Previous Evolution
        </button>
        <button
          data-testid="pokemon-next"
          className="evolution-button"
          disabled={!next}
          onClick={() => next && loadEvolution(next)}
        >
          Next Evolution →
        </button>
      </div>
    </div>
  );
}
