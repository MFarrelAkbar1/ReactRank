import ProductTable from "./components/ProductTable";
import { PRODUCTS } from "./data";
import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <h1>Products</h1>
      <ProductTable products={PRODUCTS} />
    </div>
  );
}
