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
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[420px] p-[54px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)] bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.18),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Profile</span>
          <h1 className="text-white text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] mb-2 bg-none">Login to view your profile.</h1>
          <p className="text-zinc-300 leading-[1.7]">
            Sign in to manage your account details, review order history, and
            track your NexCart purchases.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center min-h-[46px] py-3 px-5 border border-orange-500/45 rounded-lg text-orange-500 font-bold hover:text-white hover:bg-orange-500/14">
              Create Account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <section className="grid grid-cols-1 md:grid-cols-[96px_minmax(0,1fr)_auto] gap-6 md:items-center justify-items-start md:justify-items-stretch mb-[30px] p-7 border border-white/5 rounded-[14px] bg-[radial-gradient(circle_at_88%_18%,rgba(20,184,166,0.12),transparent_30%),linear-gradient(135deg,#18181b_0%,#111827_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="grid place-items-center w-[96px] h-[96px] rounded-full bg-orange-500/14 text-orange-500 text-[2rem] font-extrabold">{getInitials(user.name)}</div>
        <div>
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">My Account</span>
          <h1 className="text-white text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] mb-2 bg-none">{user.name}</h1>
          <p className="text-zinc-300 leading-[1.7]">{user.email}</p>
        </div>
        <button type="button" className="min-h-[44px] py-2.5 px-4 border border-red-500/35 rounded-lg bg-transparent text-red-300 font-bold cursor-pointer transition-all duration-300 hover:border-red-500 hover:bg-red-500/10" onClick={logout}>
          Logout
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-7 items-start">
        <aside className="lg:sticky lg:top-[112px] p-[26px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <h2 className="text-white text-[1.5rem] mb-5 bg-none">Account Details</h2>

          <div className="grid gap-1.5 py-[15px] border-b border-white/5">
            <span className="text-zinc-400 text-[0.9rem]">Name</span>
            <strong className="text-white break-words">{user.name}</strong>
          </div>
          <div className="grid gap-1.5 py-[15px] border-b border-white/5">
            <span className="text-zinc-400 text-[0.9rem]">Email</span>
            <strong className="text-white break-words">{user.email}</strong>
          </div>
          <div className="grid gap-1.5 py-[15px] border-b border-white/5">
            <span className="text-zinc-400 text-[0.9rem]">Role</span>
            <strong className="text-white break-words">{user.role || "user"}</strong>
          </div>

          <Link to="/shop" className="btn inline-flex justify-center w-full mt-[22px]">
            Continue Shopping
          </Link>
        </aside>

        <div className="grid gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Profile order stats">
            <article className="min-h-[122px] p-[22px] border border-white/5 rounded-xl bg-zinc-900">
              <span className="text-zinc-400 text-[0.9rem]">Total Orders</span>
              <strong className="block text-white text-[1.75rem] mt-3">{stats.totalOrders}</strong>
            </article>
            <article className="min-h-[122px] p-[22px] border border-white/5 rounded-xl bg-zinc-900">
              <span className="text-zinc-400 text-[0.9rem]">Active Orders</span>
              <strong className="block text-white text-[1.75rem] mt-3">{stats.activeOrders}</strong>
            </article>
            <article className="min-h-[122px] p-[22px] border border-white/5 rounded-xl bg-zinc-900">
              <span className="text-zinc-400 text-[0.9rem]">Total Spent</span>
              <strong className="block text-white text-[1.75rem] mt-3">{formatCurrency(stats.totalSpent)}</strong>
            </article>
          </section>

          <section className="p-[26px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <div>
              <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Orders</span>
              <h2 className="text-white text-[1.5rem] mb-0 bg-none">Order History</h2>
            </div>

            {loading && <div className="grid justify-items-center gap-3.5 mt-[22px] p-[30px] text-zinc-300 text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">Loading orders...</div>}
            {!loading && error && <div className="grid justify-items-center gap-3.5 mt-[22px] p-[30px] text-red-200 text-center border border-red-500/35 rounded-xl bg-red-500/10 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">{error}</div>}
            {!loading && !error && orders.length === 0 && (
              <div className="grid justify-items-center gap-3.5 mt-[22px] p-[30px] text-zinc-300 text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
                <p>You have not placed any orders yet.</p>
                <Link to="/shop" className="btn">
                  Shop Products
                </Link>
              </div>
            )}

            {!loading && !error && orders.length > 0 && (
              <div className="grid gap-4 mt-[22px]">
                {orders.map((order) => {
                  let statusClasses = "inline-block py-[7px] px-2.5 rounded-full text-amber-100 bg-amber-500/14 text-[0.82rem] font-extrabold capitalize w-fit";
                  if (order.status === "shipped") statusClasses = "inline-block py-[7px] px-2.5 rounded-full text-blue-200 bg-blue-500/15 text-[0.82rem] font-extrabold capitalize w-fit";
                  if (order.status === "delivered") statusClasses = "inline-block py-[7px] px-2.5 rounded-full text-teal-100 bg-teal-500/15 text-[0.82rem] font-extrabold capitalize w-fit";
                  
                  return (
                    <article className="p-5 border border-white/5 rounded-lg bg-zinc-950/44" key={order._id}>
                      <div className="grid sm:flex sm:justify-between gap-[18px] sm:items-start pb-4 border-b border-white/5">
                        <div>
                          <span className="text-zinc-400 text-[0.9rem]">Order ID</span>
                          <strong className="block text-white mt-1.5 break-words">{order._id}</strong>
                        </div>
                        <span className={statusClasses}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-4">
                        <div>
                          <span className="text-zinc-400 text-[0.9rem]">Date</span>
                          <strong className="block text-white mt-1.5">{formatDate(order.createdAt)}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[0.9rem]">Total</span>
                          <strong className="block text-white mt-1.5">{formatCurrency(order.totalAmount)}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[0.9rem]">Items</span>
                          <strong className="block text-white mt-1.5">{order.products?.length || 0}</strong>
                        </div>
                      </div>

                      {order.products?.length > 0 && (
                        <div className="grid gap-2.5">
                          {order.products.map((item) => {
                            const product = item.product || {};
                            return (
                              <div
                                className="flex justify-between gap-3.5 p-[12px_14px] rounded-lg bg-zinc-900/70"
                                key={`${order._id}-${product._id || item.quantity}`}
                              >
                                <span className="text-zinc-300">{product.name || "Product"}</span>
                                <strong className="text-teal-500">Qty {item.quantity}</strong>
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
