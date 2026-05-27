import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const userData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(userData.message || `Request failed with status ${res.status}`);
      }

      login(userData);
      navigate("/shop");
    } catch (err) {
      setError(err.message || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <section className="mx-auto grid max-w-4xl bg-white shadow-sm md:grid-cols-[330px_1fr]">
        <div className="bg-[#2874f0] p-8 text-white">
          <h1 className="text-3xl font-semibold text-white">Login</h1>
          <p className="mt-4 text-lg leading-7 text-blue-50">
            Get access to your orders, wishlist and recommendations.
          </p>
          <img
            src="/img/NextCartpng.png"
            alt="NexCart"
            className="mt-12 hidden w-48 rounded bg-white p-4 md:block"
          />
        </div>

        <form className="grid gap-5 p-6 sm:p-10" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="h-12 border-b border-gray-300 px-1 text-base font-normal outline-none focus:border-[#2874f0]"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="h-12 border-b border-gray-300 px-1 text-base font-normal outline-none focus:border-[#2874f0]"
            />
          </label>

          <p className="text-xs leading-5 text-gray-500">
            By continuing, you agree to NexCart terms and privacy policy.
          </p>

          <button
            type="submit"
            className="rounded-sm bg-[#fb641b] py-3 text-sm font-semibold uppercase text-white disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link
            to="/register"
            className="mt-4 text-center text-sm font-semibold text-[#2874f0]"
          >
            New to NexCart? Create an account
          </Link>
        </form>
      </section>
    </main>
  );
};

export default Login;
