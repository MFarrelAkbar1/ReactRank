import { PokemonDetails } from "./components/PokemonDetails";
import "./styles.css";

const title = "Pokemon Details";

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-logo">⚡</div>
        <h1 className="navbar-brand">{title}</h1>
        <span className="navbar-tag">Pokemon Database</span>
      </header>
      <PokemonDetails />
    </div>
  );
}
