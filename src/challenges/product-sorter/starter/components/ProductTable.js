export default function ProductTable({ products }) {
  // TODO: keep the current sort in state
  // TODO: sort a COPY of products (never mutate the prop!)
  // TODO: format the price as $0.00

  return (
    <div>
      <div className="sort-buttons">
        <button data-testid="sort-price">Sort by price</button>
        <button data-testid="sort-rating">Sort by rating</button>
      </div>

      <table data-testid="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} data-testid="product-row">
              <td data-testid="product-name">{p.name}</td>
              <td data-testid="product-price">{p.price}</td>
              <td data-testid="product-rating">{p.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
