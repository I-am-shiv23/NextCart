import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value) || 0);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user?.token || !isAdmin) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/analytics`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        setStats(data);
      } catch (err) {
        setError(err.message || "Dashboard stats could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, isAdmin]);

  const statCards = useMemo(
    () => [
      { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue) },
      { label: "Orders", value: stats?.totalOrders || 0 },
      { label: "Products", value: stats?.totalProducts || 0 },
      { label: "Customers", value: stats?.totalUsers || 0 },
    ],
    [stats]
  );

  if (!user) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Admin Access</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Login required</h1>
          <p className="text-zinc-300 leading-[1.7]">Please login with an admin account to view the dashboard.</p>
          <Link to="/login" className="btn">
            Login
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Restricted</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Admin only</h1>
          <p className="text-zinc-300 leading-[1.7]">Your account does not have permission to view this dashboard.</p>
          <Link to="/shop" className="btn">
            Back to Shop
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <header className="grid sm:flex sm:justify-between gap-6 sm:items-end mb-[30px] pb-[28px] border-b border-white/5">
        <div>
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Admin Dashboard</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Store Overview</h1>
          <p className="max-w-[720px] text-zinc-300 leading-[1.7]">
            Monitor NexCart activity, manage products, review orders, and keep
            customer records organized.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center sm:justify-end">
          <Link to="/admin/add-product" className="btn">
            Add Product
          </Link>
          <Link to="/admin/products" className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/15">
            Products
          </Link>
        </div>
      </header>

      {loading && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-zinc-300 leading-[1.7]">Loading dashboard...</div>}
      {!loading && error && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-red-500/35 rounded-xl bg-red-500/10 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-red-200 leading-[1.7]">{error}</div>}

      {!loading && !error && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[28px]" aria-label="Admin stats">
            {statCards.map((card) => (
              <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]" key={card.label}>
                <span className="text-zinc-400">{card.label}</span>
                <strong className="block text-white text-[1.9rem] mt-3">{card.value}</strong>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-7 items-start">
            <div className="p-[26px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
              <h2 className="text-white text-[1.5rem] mb-[18px] bg-none">Management Shortcuts</h2>
              <div className="grid gap-3">
                <Link to="/admin/products" className="flex justify-between gap-4 p-4 border border-white/5 rounded-lg text-zinc-50 bg-zinc-950/44 font-bold hover:border-orange-500/45 hover:text-orange-500">
                  Product Inventory <span>Manage</span>
                </Link>
                <Link to="/admin/orders" className="flex justify-between gap-4 p-4 border border-white/5 rounded-lg text-zinc-50 bg-zinc-950/44 font-bold hover:border-orange-500/45 hover:text-orange-500">
                  Customer Orders <span>Review</span>
                </Link>
                <Link to="/admin/users" className="flex justify-between gap-4 p-4 border border-white/5 rounded-lg text-zinc-50 bg-zinc-950/44 font-bold hover:border-orange-500/45 hover:text-orange-500">
                  User Accounts <span>View</span>
                </Link>
                <Link to="/admin/add-product" className="flex justify-between gap-4 p-4 border border-white/5 rounded-lg text-zinc-50 bg-zinc-950/44 font-bold hover:border-orange-500/45 hover:text-orange-500">
                  New Product <span>Create</span>
                </Link>
              </div>
            </div>

            <aside className="p-[26px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
              <h2 className="text-white text-[1.5rem] mb-[18px] bg-none">Admin Notes</h2>
              <ul className="grid gap-[14px]">
                <li className="flex justify-between gap-4 py-[14px] text-zinc-300 border-b border-white/5 last:border-b-0">
                  <span>Keep product stock current</span>
                  <strong>Daily</strong>
                </li>
                <li className="flex justify-between gap-4 py-[14px] text-zinc-300 border-b border-white/5 last:border-b-0">
                  <span>Review pending orders</span>
                  <strong>Open</strong>
                </li>
                <li className="flex justify-between gap-4 py-[14px] text-zinc-300 border-b border-white/5 last:border-b-0">
                  <span>Check user growth</span>
                  <strong>Weekly</strong>
                </li>
              </ul>
            </aside>
          </section>
        </>
      )}
    </main>
  );
};

export default AdminDashboard;
