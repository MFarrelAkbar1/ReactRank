// eslint-disable-next-line no-unused-vars
export function Pokemon({ pokemon }) {
  // TODO: render nothing while pokemon is null
  // TODO: replace the hard-coded values below with data from the `pokemon` prop
  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <div className="pokemon-id-badge">#001</div>
        <div>
          <h2 data-testid="pokemon-name">Ivysaur</h2>
          <p>
            Pokemon ID: <span data-testid="pokemon-id">1</span>
          </p>
        </div>
      </div>

      <div className="pokemon-content">
        <div>
          <div className="pokemon-section">
            <h3>Type:</h3>
            <ul data-testid="pokemon-types" className="type-badges">
              <li>
                <span className="type-badge" data-testid="pokemon-type-Grass">
                  Grass
                </span>
              </li>
              <li>
                <span className="type-badge" data-testid="pokemon-type-Poison">
                  Poison
                </span>
              </li>
            </ul>
          </div>

          <div className="pokemon-section">
            <h3>Physical Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Height:</span>
                <span className="stat-value" data-testid="pokemon-height">
                  0.71 m
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Weight:</span>
                {/* Keep the exact (dot) test id */}
                <span className="stat-value" data-testid="pokemon.weight">
                  6.9 kg
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pokemon-section">
          <strong data-testid="pokemon-weeknesses">Weaknesses:</strong>
          <ol className="weakness-list" data-testid="weakness-list">
            <li>Fire</li>
            <li>Ice</li>
            <li>Flying</li>
            <li>Psychic</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
