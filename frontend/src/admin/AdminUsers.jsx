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
      <main className="main-content">
        <section className="grid min-h-80 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">{user ? "Admin only" : "Login required"}</h1>
            <p className="mt-2 text-gray-600">Only admin users can view customer accounts.</p>
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
            <p className="text-sm font-semibold uppercase text-[#2874f0]">Customers</p>
            <h1 className="mt-2 text-3xl font-semibold">Admin Users</h1>
            <p className="mt-2 text-sm text-gray-600">View registered users and account roles.</p>
          </div>
          <Link to="/admin" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Total Users</span>
          <strong className="mt-2 block text-2xl">{stats.total}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Customers</span>
          <strong className="mt-2 block text-2xl">{stats.customers}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Admins</span>
          <strong className="mt-2 block text-2xl">{stats.admins}</strong>
        </article>
        <article className="bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">Verified</span>
          <strong className="mt-2 block text-2xl">{stats.verified}</strong>
        </article>
      </section>

      {loading && (
        <div className="mt-4 grid min-h-64 place-items-center bg-white shadow-sm text-gray-600">
          Loading users...
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
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4">User ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr className="border-t" key={item._id}>
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.role}</td>
                    <td className="p-4">{item.verified ? "Yes" : "No"}</td>
                    <td className="p-4">{item._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 md:hidden">
            {users.map((item) => (
              <article className="bg-white p-4 shadow-sm" key={item._id}>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-1 break-words text-sm text-gray-600">{item.email}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Role</span>
                    <strong className="block">{item.role}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Verified</span>
                    <strong className="block">{item.verified ? "Yes" : "No"}</strong>
                  </div>
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
