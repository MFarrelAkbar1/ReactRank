export function Pokemon({ pokemon }) {
  if (!pokemon) return null;

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <div className="pokemon-id-badge">#{pokemon.num}</div>
        <div>
          <h2 data-testid="pokemon-name">{pokemon.name}</h2>
          <p>
            Pokemon ID: <span data-testid="pokemon-id">{pokemon.id}</span>
          </p>
        </div>
      </div>

      <div className="pokemon-content">
        <div>
          <div className="pokemon-section">
            <h3>Type:</h3>
            <ul data-testid="pokemon-types" className="type-badges">
              {pokemon.type.map((t) => (
                <li key={t}>
                  <span className="type-badge" data-testid={"pokemon-type-" + t}>
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pokemon-section">
            <h3>Physical Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Height:</span>
                <span className="stat-value" data-testid="pokemon-height">
                  {pokemon.height}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Weight:</span>
                {/* Keep the exact (dot) test id */}
                <span className="stat-value" data-testid="pokemon.weight">
                  {pokemon.weight}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pokemon-section">
          <strong data-testid="pokemon-weeknesses">Weaknesses:</strong>
          <ol className="weakness-list" data-testid="weakness-list">
            {pokemon.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
