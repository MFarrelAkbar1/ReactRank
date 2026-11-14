# Pokemon Details

Finish a small Pokedex app. The user types a Pokemon ID, the app loads that Pokemon from an API and shows a details card, and two buttons move along the evolution chain.

The app has three files:

| File | What it does |
|---|---|
| `App.js` | Page layout. Renders `<PokemonDetails />`. **Already done.** |
| `components/PokemonDetails.js` | Search form, data fetching, evolution buttons. **TODO** |
| `components/Pokemon.js` | The details card. It currently shows **hard-coded** values and ignores its `pokemon` prop. **TODO** |

## API

```
GET https://jsonmock.hackerrank.com/api/pokemon?id=<id>
```

Example: ID `1` calls `https://jsonmock.hackerrank.com/api/pokemon?id=1`, which returns:

```json
{
  "data": {
    "id": 1,
    "num": "001",
    "name": "Bulbasaur",
    "type": ["Grass", "Poison"],
    "height": "0.71 m",
    "weight": "6.9 kg",
    "weaknesses": ["Fire", "Ice", "Flying", "Psychic"],
    "next_evolution": [
      { "num": "002", "name": "Ivysaur" },
      { "num": "003", "name": "Venusaur" }
    ]
  }
}
```

> ⚠️ `data` is a single **object**, not an array. Some Pokemon have `prev_evolution` and/or `next_evolution`, and some have neither.

## Requirements

### Search (`PokemonDetails`)
1. The number input (`data-testid="id-input"`) is **controlled**.
2. Clicking **Get Pokemon** (`data-testid="random-pokemon"`):
   - If the ID is empty or not between **1 and 151** (inclusive), call `alert("Pokemon ID must be between 1 and 151")` and do **not** make a request.
   - Otherwise, `fetch` the URL above and pass `data` to `<Pokemon pokemon={...} />`.

### Card (`Pokemon`)
3. While no Pokemon has been loaded (`pokemon` is `null`), render **nothing**.
4. When a Pokemon is loaded, show its real data instead of the hard-coded values:

| What | `data-testid` | Example |
|---|---|---|
| Name | `pokemon-name` | `Bulbasaur` |
| ID | `pokemon-id` | `1` |
| Badge | (none) | `#001` (the `num` field) |
| Type list (`<ul>`) | `pokemon-types` | one `<li>` per type |
| Each type badge | `pokemon-type-<Type>` | `pokemon-type-Grass` |
| Height | `pokemon-height` | `0.71 m` (as returned) |
| Weight | `pokemon.weight` ⚠️ with a **dot** | `6.9 kg` (as returned) |
| Weaknesses label | `pokemon-weeknesses` (keep this spelling) | `Weaknesses:` |
| Weaknesses list (`<ol>`) | `weakness-list` | one `<li>` per weakness |

### Evolution buttons (`PokemonDetails`)
5. **Next Evolution →** (`data-testid="pokemon-next"`) loads the **immediate** next evolution, which is the **first** item of `next_evolution`.
6. **← Previous Evolution** (`data-testid="pokemon-prev"`) loads the **immediate** previous evolution, which is the **last** item of `prev_evolution`.
7. Use the evolution's `num` to get the ID (`"002"` → `2`), fetch it from the same API, and update the input to show the new ID.
8. A button is **disabled** when there is no Pokemon loaded, or when there is no evolution in that direction.

## Example

```
Type 152, click Get Pokemon   → alert "Pokemon ID must be between 1 and 151"
Type 1,   click Get Pokemon   → Bulbasaur card, Previous disabled
Click Next Evolution          → Ivysaur (input shows 2)
Click Next Evolution          → Venusaur, Next disabled
Click Previous Evolution      → Ivysaur
```

## Notes
- The tests mock `fetch` and `alert`. Call them as plain `fetch(...)` / `alert(...)` (or `window.alert`).
- Test IDs are case-sensitive. Copy them exactly, including the odd ones (`pokemon.weight`, `pokemon-weeknesses`).
