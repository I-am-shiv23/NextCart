import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../config";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Products could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="shop-container">
      <h2>Shop Products</h2>
      {loading && <div>Loading...</div>}
      {!loading && error && <div>{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[30px] mt-[30px]">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Shop;
