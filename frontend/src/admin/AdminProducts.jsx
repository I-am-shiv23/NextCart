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
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Admin Products</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">{user ? "Admin only" : "Login required"}</h1>
          <p className="text-zinc-300 leading-[1.7]">Only admin users can manage products.</p>
          <Link to={user ? "/shop" : "/login"} className="btn">
            {user ? "Back to Shop" : "Login"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <header className="grid sm:flex sm:justify-between gap-6 sm:items-end mb-[30px] pb-[28px] border-b border-white/5">
        <div>
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Inventory</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Admin Products</h1>
          <p className="max-w-[720px] text-zinc-300 leading-[1.7]">Review, edit, and remove products listed in the NexCart store.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center sm:justify-end">
          <Link to="/admin/add-product" className="btn">
            Add Product
          </Link>
          <Link to="/admin" className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/15">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[28px]" aria-label="Product stats">
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Total Products</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.total}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">In Stock</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.inStock}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Out of Stock</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.outOfStock}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Actions</span>
          <strong className="block text-white text-[1.9rem] mt-3">Edit</strong>
        </article>
      </section>

      {loading && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-zinc-300 leading-[1.7]">Loading products...</div>}
      {!loading && error && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-red-500/35 rounded-xl bg-red-500/10 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-red-200 leading-[1.7]">{error}</div>}

      {!loading && !error && (
        <>
          <div className="hidden sm:block overflow-hidden border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Product</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Category</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Price</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Stock</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const imageUrl =
                    product.imageUrl?.trim() || product.imageUri?.trim() || "/img/NextCartpng.png";

                  return (
                    <tr key={product._id}>
                      <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">
                        <div className="flex gap-[14px] items-center">
                          <img src={imageUrl} alt={product.name} className="w-[58px] h-[58px] rounded-lg object-cover bg-zinc-950" />
                          <strong className="text-white font-bold">{product.name}</strong>
                        </div>
                      </td>
                      <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{product.category}</td>
                      <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{formatCurrency(product.price)}</td>
                      <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{product.stock}</td>
                      <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">
                        <div className="flex flex-wrap gap-2.5">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-red-500/35 bg-transparent text-red-300 hover:text-red-200 hover:border-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="grid gap-[14px] sm:hidden">
            {products.map((product) => (
              <article className="grid gap-[14px] p-[18px] border border-white/5 rounded-[10px] bg-zinc-900" key={product._id}>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Name</span>
                  <strong className="text-white font-bold">{product.name}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Price</span>
                  <strong className="text-white font-bold">{formatCurrency(product.price)}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Stock</span>
                  <strong className="text-white font-bold">{product.stock}</strong>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-red-500/35 bg-transparent text-red-300 hover:text-red-200 hover:border-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
