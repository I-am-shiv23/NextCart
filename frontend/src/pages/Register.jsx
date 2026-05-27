import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const userData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(userData.message || `Request failed with status ${res.status}`);
      }

      login(userData);
      setMessage("Account created successfully. Redirecting...");
      setTimeout(() => navigate("/shop"), 700);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <section className="mx-auto grid max-w-5xl bg-white shadow-sm md:grid-cols-[340px_1fr]">
        <div className="bg-[#2874f0] p-8 text-white">
          <h1 className="text-3xl font-semibold text-white">Looks like you are new here</h1>
          <p className="mt-4 text-lg leading-7 text-blue-50">
            Sign up with your details to start shopping on NexCart.
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
          {message && (
            <div className="rounded border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="h-12 border-b border-gray-300 px-1 text-base font-normal outline-none focus:border-[#2874f0]"
            />
          </label>

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

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                minLength="6"
                required
                className="h-12 border-b border-gray-300 px-1 text-base font-normal outline-none focus:border-[#2874f0]"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                minLength="6"
                required
                className="h-12 border-b border-gray-300 px-1 text-base font-normal outline-none focus:border-[#2874f0]"
              />
            </label>
          </div>

          <p className="text-xs leading-5 text-gray-500">
            By registering, you agree to NexCart terms and privacy policy.
          </p>

          <button
            type="submit"
            className="rounded-sm bg-[#fb641b] py-3 text-sm font-semibold uppercase text-white disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <Link to="/login" className="text-center text-sm font-semibold text-[#2874f0]">
            Existing User? Login
          </Link>
        </form>
      </section>
    </main>
  );
};

export default Register;
