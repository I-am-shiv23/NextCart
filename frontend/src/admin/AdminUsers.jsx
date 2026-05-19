import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user?.token || !isAdmin) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Users could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, isAdmin]);

  const stats = useMemo(() => {
    const admins = users.filter((item) => item.role === "admin").length;
    return {
      total: users.length,
      admins,
      customers: users.length - admins,
      verified: users.filter((item) => item.verified).length,
    };
  }, [users]);

  if (!user || !isAdmin) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Admin Users</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">{user ? "Admin only" : "Login required"}</h1>
          <p className="text-zinc-300 leading-[1.7]">Only admin users can view customer accounts.</p>
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
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3 uppercase">Customers</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Admin Users</h1>
          <p className="max-w-[720px] text-zinc-300 leading-[1.7]">View registered users and identify account roles.</p>
        </div>
        <Link to="/admin" className="inline-flex items-center justify-center min-h-[42px] p-[10px_14px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/15">
          Dashboard
        </Link>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[28px]" aria-label="User stats">
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Total Users</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.total}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Customers</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.customers}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Admins</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.admins}</strong>
        </article>
        <article className="min-h-[130px] p-[22px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
          <span className="text-zinc-400">Verified</span>
          <strong className="block text-white text-[1.9rem] mt-3">{stats.verified}</strong>
        </article>
      </section>

      {loading && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-zinc-300 leading-[1.7]">Loading users...</div>}
      {!loading && error && <div className="grid justify-items-center gap-4 min-h-[320px] p-[40px_24px] text-center border border-red-500/35 rounded-xl bg-red-500/10 shadow-[0_18px_45px_rgba(0,0,0,0.24)] text-red-200 leading-[1.7]">{error}</div>}

      {!loading && !error && (
        <>
          <div className="hidden sm:block overflow-hidden border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Name</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Email</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Role</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">Verified</th>
                  <th className="text-zinc-400 text-[0.82rem] font-extrabold tracking-[0.06em] uppercase p-4 text-left align-middle border-b border-white/5">User ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">
                      <strong className="text-white font-bold">{item.name}</strong>
                    </td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{item.email}</td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{item.role}</td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{item.verified ? "Yes" : "No"}</td>
                    <td className="text-zinc-300 p-4 text-left align-middle border-b border-white/5">{item._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-[14px] sm:hidden">
            {users.map((item) => (
              <article className="grid gap-[14px] p-[18px] border border-white/5 rounded-[10px] bg-zinc-900" key={item._id}>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Name</span>
                  <strong className="text-white font-bold">{item.name}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Email</span>
                  <strong className="text-white font-bold">{item.email}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Role</span>
                  <strong className="text-white font-bold">{item.role}</strong>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span className="text-zinc-400">Verified</span>
                  <strong className="text-white font-bold">{item.verified ? "Yes" : "No"}</strong>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default AdminUsers;
