import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../config";
import { useSearch } from "../context/SearchContext";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const { searchQuery } = useSearch();

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

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Products could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const names = products.map((product) => product.category).filter(Boolean);
    return ["All", ...new Set(names)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchText = searchQuery.toLowerCase().trim();

    const list = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchText);
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "low") {
      return [...list].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "high") {
      return [...list].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "rating") {
      return [...list].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return list;
  }, [products, searchQuery, category, sortBy]);

  return (
    <main className="main-content">
      <div className="mb-4 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">Shop Products</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search, filter and find your next product from NexCart.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <h2 className="border-b pb-3 text-lg font-semibold">Filters</h2>

          <div className="mt-4">
            <p className="mb-3 text-sm font-semibold uppercase text-gray-500">Category</p>
            <div className="grid gap-2">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={
                    category === item
                      ? "rounded border border-[#2874f0] bg-blue-50 px-3 py-2 text-left text-sm font-semibold text-[#2874f0]"
                      : "rounded border border-gray-200 px-3 py-2 text-left text-sm text-gray-700 hover:border-[#2874f0]"
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold uppercase text-gray-500">Sort By</p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#2874f0]"
            >
              <option value="popular">Popularity</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </aside>

        <div className="bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {category === "All" ? "All Products" : category}
              </h2>
              <p className="text-sm text-gray-500">{filteredProducts.length} items found</p>
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Search result for <span className="font-semibold">"{searchQuery}"</span>
              </p>
            )}
          </div>

          {loading && (
            <div className="grid min-h-72 place-items-center text-gray-600">
              Loading products...
            </div>
          )}

          {!loading && error && (
            <div className="m-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="grid min-h-72 place-items-center p-6 text-center">
              <div>
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="mt-2 text-gray-600">Try another search or category.</p>
              </div>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid gap-px bg-gray-100 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Shop;
