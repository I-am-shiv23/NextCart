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

  if (!user || !isAdmin) {
    return (
      <main className="main-content">
        <section className="grid min-h-80 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">{user ? "Admin only" : "Login required"}</h1>
            <p className="mt-2 text-gray-600">Only admin users can view the dashboard.</p>
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
            <p className="text-sm font-semibold uppercase text-[#2874f0]">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Store Overview</h1>
            <p className="mt-2 text-sm text-gray-600">Manage products, orders and customers.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/add-product" className="btn">
              Add Product
            </Link>
            <Link to="/admin/products" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
              Products
            </Link>
          </div>
        </div>
      </header>

      {loading && (
        <div className="mt-4 grid min-h-64 place-items-center bg-white shadow-sm text-gray-600">
          Loading dashboard...
        </div>
      )}

      {!loading && error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <article className="bg-white p-5 shadow-sm" key={card.label}>
                <span className="text-sm text-gray-500">{card.label}</span>
                <strong className="mt-2 block text-2xl">{card.value}</strong>
              </article>
            ))}
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_330px]">
            <div className="bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Management Shortcuts</h2>
              <div className="mt-4 grid gap-3">
                <Link to="/admin/products" className="flex justify-between bg-[#f1f3f6] p-4 font-semibold hover:text-[#2874f0]">
                  Product Inventory <span>Manage</span>
                </Link>
                <Link to="/admin/orders" className="flex justify-between bg-[#f1f3f6] p-4 font-semibold hover:text-[#2874f0]">
                  Customer Orders <span>Review</span>
                </Link>
                <Link to="/admin/users" className="flex justify-between bg-[#f1f3f6] p-4 font-semibold hover:text-[#2874f0]">
                  User Accounts <span>View</span>
                </Link>
                <Link to="/admin/add-product" className="flex justify-between bg-[#f1f3f6] p-4 font-semibold hover:text-[#2874f0]">
                  New Product <span>Create</span>
                </Link>
              </div>
            </div>

            <aside className="bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Admin Notes</h2>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between border-b pb-3">
                  <span>Keep stock updated</span>
                  <strong>Daily</strong>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span>Review pending orders</span>
                  <strong>Open</strong>
                </div>
                <div className="flex justify-between">
                  <span>Check user growth</span>
                  <strong>Weekly</strong>
                </div>
              </div>
            </aside>
          </section>
        </>
      )}
    </main>
  );
};

export default AdminDashboard;
