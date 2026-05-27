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
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (!user || !isAdmin) {
    return (
      <main className="main-content">
        <section className="grid min-h-80 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">{user ? "Admin only" : "Login required"}</h1>
            <p className="mt-2 text-gray-600">Only admin users can manage orders.</p>
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
            <p className="text-sm font-semibold uppercase text-[#2874f0]">Orders</p>
            <h1 className="mt-2 text-3xl font-semibold">Admin Orders</h1>
            <p className="mt-2 text-sm text-gray-600">Review orders and update fulfillment status.</p>
          </div>
          <Link to="/admin" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Total Orders</span>
          <strong className="mt-2 block text-2xl">{stats.total}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Pending</span>
          <strong className="mt-2 block text-2xl">{stats.pending}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Shipped</span>
          <strong className="mt-2 block text-2xl">{stats.shipped}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Revenue</span>
          <strong className="mt-2 block text-2xl">{formatCurrency(stats.revenue)}</strong>
        </article>
      </section>

      {loading && (
        <div className="mt-4 grid min-h-64 place-items-center bg-white shadow-sm text-gray-600">
          Loading orders...
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
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr className="border-t" key={order._id}>
                    <td className="p-4 font-semibold">{order._id}</td>
                    <td className="p-4">{order.user?.name || "Customer"}</td>
                    <td className="p-4">{formatDate(order.createdAt)}</td>
                    <td className="p-4">{formatCurrency(order.totalAmount)}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        className="h-10 rounded border border-gray-300 bg-white px-3 outline-none focus:border-[#2874f0]"
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

          <div className="mt-4 grid gap-3 md:hidden">
            {orders.map((order) => (
              <article className="bg-white p-4 shadow-sm" key={order._id}>
                <div className="flex justify-between gap-3">
                  <strong className="break-words text-sm">{order._id}</strong>
                  <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{order.user?.name || "Customer"}</p>
                <p className="mt-2 font-semibold">{formatCurrency(order.totalAmount)}</p>
                <select
                  className="mt-3 h-10 w-full rounded border border-gray-300 bg-white px-3 outline-none focus:border-[#2874f0]"
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
