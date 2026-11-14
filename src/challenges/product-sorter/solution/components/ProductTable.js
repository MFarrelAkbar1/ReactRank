import { useState } from "react";

const formatPrice = (price) => "$" + Number(price).toFixed(2);

export default function ProductTable({ products }) {
  // sort: null (original order) | { key: "price", dir: "asc" | "desc" } | { key: "rating" }
  const [sort, setSort] = useState(null);

  const togglePrice = () =>
    setSort((s) => ({ key: "price", dir: s?.key === "price" && s.dir === "asc" ? "desc" : "asc" }));
  const sortByRating = () => setSort({ key: "rating" });

  // Copy first: Array.prototype.sort mutates in place, and props must never be mutated.
  // Modern sort is stable, so equal ratings keep their original order.
  let rows = products;
  if (sort?.key === "price") {
    rows = [...products].sort((a, b) => (sort.dir === "asc" ? a.price - b.price : b.price - a.price));
  } else if (sort?.key === "rating") {
    rows = [...products].sort((a, b) => b.rating - a.rating);
  }

  const priceArrow = sort?.key === "price" ? (sort.dir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div>
      <div className="sort-buttons">
        <button data-testid="sort-price" onClick={togglePrice}>
          Sort by price{priceArrow}
        </button>
        <button data-testid="sort-rating" onClick={sortByRating}>
          Sort by rating{sort?.key === "rating" ? " ↓" : ""}
        </button>
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
          {rows.map((p) => (
            <tr key={p.id} data-testid="product-row">
              <td data-testid="product-name">{p.name}</td>
              <td data-testid="product-price">{formatPrice(p.price)}</td>
              <td data-testid="product-rating">{p.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
