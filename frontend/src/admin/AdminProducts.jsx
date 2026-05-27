import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value) || 0);

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user?.token || !isAdmin) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
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
        setError(err.message || "Products could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, isAdmin]);

  const stats = useMemo(() => {
    const inStock = products.filter((product) => Number(product.stock) > 0).length;
    return {
      total: products.length,
      inStock,
      outOfStock: products.length - inStock,
    };
  }, [products]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product permanently?");
    if (!confirmed) return;

    try {
      setDeletingId(productId);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (err) {
      setError(err.message || "Product could not be deleted.");
    } finally {
      setDeletingId("");
    }
  };

  if (!user || !isAdmin) {
    return (
      <main className="main-content">
        <section className="grid min-h-80 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">{user ? "Admin only" : "Login required"}</h1>
            <p className="mt-2 text-gray-600">Only admin users can manage products.</p>
            <Link to={user ? "/shop" : "/login"} className="btn mt-5">
              {user ? "Back to Shop" : "Login"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <header className="bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#2874f0]">Inventory</p>
            <h1 className="mt-2 text-3xl font-semibold">Admin Products</h1>
            <p className="mt-2 text-sm text-gray-600">Review, edit and remove listed products.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/add-product" className="btn">
              Add Product
            </Link>
            <Link to="/admin" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Total Products</span>
          <strong className="mt-2 block text-2xl">{stats.total}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">In Stock</span>
          <strong className="mt-2 block text-2xl">{stats.inStock}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Out of Stock</span>
          <strong className="mt-2 block text-2xl">{stats.outOfStock}</strong>
        </article>
      </section>

      {loading && (
        <div className="mt-4 grid min-h-64 place-items-center bg-white shadow-sm text-gray-600">
          Loading products...
        </div>
      )}

      {!loading && error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-4 hidden overflow-hidden bg-white shadow-sm md:block">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#f1f3f6] text-left text-gray-600">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const imageUrl =
                    product.imageUrl?.trim() || product.imageUri?.trim() || "/img/NextCartpng.png";

                  return (
                    <tr className="border-t" key={product._id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={imageUrl} alt={product.name} className="h-14 w-14 border object-contain" />
                          <strong>{product.name}</strong>
                        </div>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{formatCurrency(product.price)}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="rounded border border-[#2874f0] px-3 py-2 font-semibold text-[#2874f0]"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="rounded border border-red-200 px-3 py-2 font-semibold text-red-600 disabled:text-gray-400"
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                          >
                            {deletingId === product._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 md:hidden">
            {products.map((product) => (
              <article className="bg-white p-4 shadow-sm" key={product._id}>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span>{formatCurrency(product.price)}</span>
                  <span>{product.stock} in stock</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="rounded border border-[#2874f0] px-3 py-2 text-sm font-semibold text-[#2874f0]"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default AdminProducts;
