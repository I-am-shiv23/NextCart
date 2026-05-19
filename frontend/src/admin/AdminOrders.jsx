import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const statusOptions = ["pending", "shipped", "delivered"];

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user?.token || !isAdmin) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Orders could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAdmin]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0
    );
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      shipped: orders.filter((order) => order.status === "shipped").length,
      revenue: totalRevenue,
    };
  }, [orders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setSavingId(orderId);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order?.status || status }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Order status could not be updated.");
    } finally {
      setSavingId("");
    }
  };

  const getStatusClass = (status) => {
    if (status === "shipped") return "text-blue-200 bg-blue-500/15";
    if (status === "delivered") return "text-teal-100 bg-teal-500/15";
    return "text-amber-100 bg-amber-500/14"; // pending
  };

  if (!user || !isAdmin) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Admin Orders</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">{user ? "Admin only" : "Login required"}</h1>
          <p className="text-zinc-300 leading-[1.7]">Only admin users can manage orders.</p>
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
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Orders</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Admin Orders</h1>
          <p className="max-w-[720px] text-zinc-300 leading-[1.7]">Review customer orders and update fulfillment status.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center sm:justify-end">
          <Link to="/admin" className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/15">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[28px]" aria-label="Order stats">
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Total Orders</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.total}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Pending</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.pending}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Shipped</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.shipped}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Revenue</span>
          <strong className="block text-white text-[1.9rem] mt-3">{formatCurrency(stats.revenue)}</strong>
        </article>
      </section>

      {loading && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-zinc-300 leading-[1.7]">Loading orders...</div>}
      {!loading && error && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-red-500/35 rounded-xl bg-red-500/10 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-red-200 leading-[1.7]">{error}</div>}

      {!loading && !error && (
        <>
          <div className="hidden sm:block overflow-hidden border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Order</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Customer</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Date</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Total</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Status</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">
                      <strong className="text-white font-bold">{order._id}</strong>
                    </td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{order.user?.name || "Customer"}</td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{formatDate(order.createdAt)}</td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{formatCurrency(order.totalAmount)}</td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">
                      <span className={`inline-flex p-[7px_10px] rounded-full text-[0.82rem] font-extrabold capitalize ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">
                      <select
                        className="min-h-[42px] p-[10px_12px] border border-zinc-800 rounded-lg bg-zinc-950 text-zinc-50 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(order._id, event.target.value)
                        }
                        disabled={savingId === order._id}
                      >
                        {statusOptions.map((status) => (
                          <option value={status} key={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-[14px] sm:hidden">
            {orders.map((order) => (
              <article className="grid gap-[14px] p-[18px] border border-white/5 rounded-[10px] bg-zinc-900" key={order._id}>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Order</span>
                  <strong className="text-white font-bold">{order._id}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Customer</span>
                  <strong className="text-white font-bold">{order.user?.name || "Customer"}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Total</span>
                  <strong className="text-white font-bold">{formatCurrency(order.totalAmount)}</strong>
                </div>
                <select
                  className="min-h-[42px] p-[10px_12px] border border-zinc-800 rounded-lg bg-zinc-950 text-zinc-50 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  value={order.status}
                  onChange={(event) =>
                    handleStatusChange(order._id, event.target.value)
                  }
                  disabled={savingId === order._id}
                >
                  {statusOptions.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default AdminOrders;
