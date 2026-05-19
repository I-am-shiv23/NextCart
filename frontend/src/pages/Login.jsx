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
    <main className="w-full max-w-[1080px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[52px] sm:px-5 sm:pb-[76px]">
      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.8fr)] min-h-[600px] overflow-hidden border border-white/5 rounded-[10px] sm:rounded-[14px] bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
        <div className="flex flex-col justify-center p-[30px_20px] sm:p-[54px_44px] bg-[radial-gradient(circle_at_14%_18%,rgba(249,115,22,0.24),transparent_32%),radial-gradient(circle_at_86%_84%,rgba(20,184,166,0.16),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-[18px] uppercase">Welcome Back</span>
          <h1 className="max-w-[560px] text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[22px]">Login to your NexCart account.</h1>
          <p className="max-w-[560px] text-[1.08rem] text-zinc-300 leading-[1.7]">
            Access your saved details, manage your shopping experience, and get
            back to browsing products faster.
          </p>

          <div className="flex flex-wrap gap-3.5 items-center mt-[34px] p-[18px] border border-white/5 rounded-lg bg-zinc-950/40">
            <span className="text-zinc-50 font-bold">New to NexCart?</span>
            <Link to="/register" className="inline-flex items-center justify-center min-h-[44px] py-2.5 px-[18px] border border-orange-500/45 rounded-lg text-orange-500 font-bold hover:text-white hover:bg-orange-500/15">
              Create Account
            </Link>
          </div>
        </div>

        <form className="flex flex-col justify-center gap-[18px] p-[30px_20px] sm:p-[40px_36px]" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-white text-[2rem] mb-2 bg-none">Login</h2>
            <p className="text-zinc-300 leading-[1.7]">Enter your email and password to continue.</p>
          </div>

          {error && <div className="p-[13px_15px] border border-red-500/35 rounded-lg bg-red-500/12 text-red-200 font-semibold leading-[1.5]">{error}</div>}

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
              placeholder="Enter your password"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <button type="submit" className="btn w-full min-h-[50px] mt-1.5 disabled:cursor-not-allowed disabled:opacity-[0.7] disabled:transform-none" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-3 text-zinc-500 before:content-[''] before:flex-1 before:h-px before:bg-white/5 after:content-[''] after:flex-1 after:h-px after:bg-white/5">
            <span>or</span>
          </div>

          <Link to="/register" className="inline-flex items-center justify-center w-full min-h-[50px] py-2.5 px-[18px] border border-orange-500/45 rounded-lg text-orange-500 font-bold hover:text-white hover:bg-orange-500/15">
            Register if you do not have an account
          </Link>
        </form>
      </section>
    </main>
  );
};

export default Login;
