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
    <main className="w-full max-w-[1180px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[48px] sm:px-5 sm:pb-[72px]">
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] gap-[34px] items-stretch">
        <div className="flex flex-col justify-center min-h-auto lg:min-h-[620px] p-[28px_20px] sm:p-[54px_44px] border border-white/5 rounded-[10px] sm:rounded-[14px] bg-[radial-gradient(circle_at_12%_16%,rgba(249,115,22,0.22),transparent_32%),radial-gradient(circle_at_88%_86%,rgba(20,184,166,0.16),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.34)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-[18px] uppercase">Create Account</span>
          <h1 className="max-w-[620px] text-white text-[clamp(2.25rem,5vw,4.35rem)] leading-[1.05] mb-[22px]">Join NexCart and start shopping smarter.</h1>
          <p className="max-w-[620px] text-[1.1rem] text-zinc-300 leading-[1.7]">
            Create your account to save your details, manage orders, and enjoy a
            faster checkout experience across the store.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-[36px]" aria-label="Registration benefits">
            <span className="p-[15px_14px] border border-white/5 rounded-lg bg-[rgba(9,9,11,0.42)] text-zinc-50 font-bold text-center">Secure account</span>
            <span className="p-[15px_14px] border border-white/5 rounded-lg bg-[rgba(9,9,11,0.42)] text-zinc-50 font-bold text-center">Order tracking</span>
            <span className="p-[15px_14px] border border-white/5 rounded-lg bg-[rgba(9,9,11,0.42)] text-zinc-50 font-bold text-center">Faster checkout</span>
          </div>
        </div>

        <form className="flex flex-col justify-center gap-[18px] p-[28px_20px] sm:p-[36px] border border-white/5 rounded-[10px] sm:rounded-[14px] bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.28)]" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-white text-[2rem] mb-2 bg-none">Register</h2>
            <p className="text-zinc-300 leading-[1.7]">Enter your details below to create a NexCart account.</p>
          </div>

          {error && <div className="p-[13px_15px] rounded-lg font-semibold leading-[1.5] text-red-200 border border-red-500/35 bg-red-500/12">{error}</div>}
          {message && <div className="p-[13px_15px] rounded-lg font-semibold leading-[1.5] text-teal-100 border border-teal-500/35 bg-teal-500/12">{message}</div>}

          <label className="grid gap-2 text-zinc-50 font-semibold">
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <label className="grid gap-2 text-zinc-50 font-semibold">
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <label className="grid gap-2 text-zinc-50 font-semibold">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              minLength="6"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <label className="grid gap-2 text-zinc-50 font-semibold">
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              minLength="6"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <button type="submit" className="btn w-full min-h-[50px] mt-1.5 disabled:cursor-not-allowed disabled:opacity-[0.7] disabled:transform-none" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-zinc-300 leading-[1.7]">
            Already have an account? <Link to="/login" className="text-orange-500 font-bold hover:text-orange-400">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Register;
