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

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "NC";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
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
        setError(err.message || "Orders could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0
    );
    const activeOrders = orders.filter((order) => order.status !== "delivered").length;

    return {
      totalOrders: orders.length,
      totalSpent,
      activeOrders,
    };
  }, [orders]);

  if (!user) {
    return (
      <main className="main-content">
        <section className="grid min-h-96 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Login to view your profile</h1>
            <p className="mt-2 text-gray-600">Sign in to see account details and order history.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit bg-white shadow-sm lg:sticky lg:top-24">
          <div className="bg-[#2874f0] p-5 text-white">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-[#2874f0]">
                {getInitials(user.name)}
              </span>
              <div>
                <p className="text-sm text-blue-100">Hello,</p>
                <h1 className="text-xl font-semibold text-white">{user.name}</h1>
              </div>
            </div>
          </div>

          <div className="grid gap-1 p-5 text-sm">
            <p className="font-semibold text-gray-500">Account Details</p>
            <div className="mt-3 border-b pb-3">
              <p className="text-gray-500">Email</p>
              <p className="break-words font-semibold">{user.email}</p>
            </div>
            <div className="border-b py-3">
              <p className="text-gray-500">Role</p>
              <p className="font-semibold">{user.role || "user"}</p>
            </div>
            <Link to="/shop" className="mt-4 rounded bg-[#2874f0] px-4 py-3 text-center font-semibold text-white">
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded border border-red-200 px-4 py-3 font-semibold text-red-600"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="grid gap-4">
          <section className="grid gap-4 sm:grid-cols-3">
            <article className="bg-white p-5 shadow-sm">
              <span className="text-sm text-gray-500">Total Orders</span>
              <strong className="mt-2 block text-2xl">{stats.totalOrders}</strong>
            </article>
            <article className="bg-white p-5 shadow-sm">
              <span className="text-sm text-gray-500">Active Orders</span>
              <strong className="mt-2 block text-2xl">{stats.activeOrders}</strong>
            </article>
            <article className="bg-white p-5 shadow-sm">
              <span className="text-sm text-gray-500">Total Spent</span>
              <strong className="mt-2 block text-2xl">{formatCurrency(stats.totalSpent)}</strong>
            </article>
          </section>

          <section className="bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="text-xl font-semibold">My Orders</h2>
              <p className="mt-1 text-sm text-gray-500">Track and review your NexCart orders.</p>
            </div>

            {loading && (
              <div className="grid min-h-56 place-items-center text-gray-600">
                Loading orders...
              </div>
            )}

            {!loading && error && (
              <div className="m-5 rounded border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && orders.length === 0 && (
              <div className="grid min-h-56 place-items-center p-6 text-center">
                <div>
                  <p className="text-gray-600">You have not placed any orders yet.</p>
                  <Link to="/shop" className="btn mt-4">
                    Shop Products
                  </Link>
                </div>
              </div>
            )}

            {!loading && !error && orders.length > 0 && (
              <div className="divide-y">
                {orders.map((order) => {
                  let statusClass = "bg-yellow-100 text-yellow-700";
                  if (order.status === "shipped") statusClass = "bg-blue-100 text-blue-700";
                  if (order.status === "delivered") statusClass = "bg-green-100 text-green-700";

                  return (
                    <article className="p-5" key={order._id}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <strong className="break-words text-sm">{order._id}</strong>
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <span className="text-gray-500">Date</span>
                          <strong className="block">{formatDate(order.createdAt)}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500">Total</span>
                          <strong className="block">{formatCurrency(order.totalAmount)}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500">Items</span>
                          <strong className="block">{order.products?.length || 0}</strong>
                        </div>
                      </div>

                      {order.products?.length > 0 && (
                        <div className="mt-4 grid gap-2">
                          {order.products.map((item) => {
                            const product = item.product || {};
                            return (
                              <div
                                className="flex justify-between gap-3 bg-[#f1f3f6] p-3 text-sm"
                                key={`${order._id}-${product._id || item.quantity}`}
                              >
                                <span>{product.name || "Product"}</span>
                                <strong>Qty {item.quantity}</strong>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Profile;
