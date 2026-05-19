import React from "react";
import { Link } from "react-router-dom";

const values = [
  {
    title: "Curated Picks",
    text: "We focus on products that feel useful, reliable, and worth coming back for.",
  },
  {
    title: "Simple Shopping",
    text: "NexCart keeps browsing, comparing, and checkout clear from the first click.",
  },
  {
    title: "Customer First",
    text: "Every part of the store is shaped around trust, fast support, and easy returns.",
  },
];

const stats = [
  { value: "500+", label: "Products" },
  { value: "24/7", label: "Support" },
  { value: "99%", label: "Secure checkout" },
];

const About = () => {
  return (
    <main className="flex flex-col gap-[34px] sm:gap-[50px] w-full max-w-[1240px] mx-auto pt-[42px] px-5 pb-[64px]">
      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] items-center gap-10 py-[34px] px-5 sm:py-[52px] sm:px-6 md:py-[70px] md:px-9 border border-white/5 rounded-xl md:rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.38)] overflow-hidden bg-[radial-gradient(circle_at_85%_15%,rgba(20,184,166,0.16),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(249,115,22,0.2),transparent_36%),linear-gradient(135deg,#18181b_0%,#0f172a_100%)]">
        <div className="max-w-[700px]">
          <span className="inline-flex items-center gap-2 text-orange-500 text-[0.82rem] font-bold tracking-[0.08em] mb-4 uppercase">About NexCart</span>
          <h1 className="max-w-[760px] text-white text-[clamp(2.3rem,5vw,4.5rem)] leading-[1.05] mb-[22px]">Built for smooth, confident online shopping.</h1>
          <p className="max-w-[630px] text-[1.1rem] mb-[30px] text-zinc-300 leading-[1.7]">
            NexCart brings quality products, clear pricing, and a clean shopping
            experience together in one modern ecommerce platform.
          </p>
          <Link to="/shop" className="btn min-w-[170px]">
            Explore Products
          </Link>
        </div>

        <div className="justify-self-center grid place-items-center w-full max-w-[290px] md:max-w-[360px] aspect-square border border-white/10 rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)),rgba(9,9,11,0.5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" aria-label="NexCart brand showcase">
          <img src="/img/NextCartpng.png" alt="NexCart logo" className="w-[68%] max-w-[240px] h-auto rounded-[18px] drop-shadow-[0_18px_32px_rgba(0,0,0,0.45)]" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(280px,1fr)] gap-[35px] items-start">
        <div>
          <span className="inline-flex items-center gap-2 text-orange-500 text-[0.82rem] font-bold tracking-[0.08em] mb-4 uppercase">Our Story</span>
          <h2 className="mb-0">Shopping that feels organized, fast, and dependable.</h2>
        </div>
        <p className="text-zinc-300 leading-[1.7]">
          We created NexCart to make everyday ecommerce feel less crowded and
          more helpful. From featured products to simple navigation, the goal is
          to help customers find what they need without friction.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-[22px]" aria-label="NexCart values">
        {values.map((value) => (
          <article className="min-h-[190px] p-7 border border-white/5 rounded-xl bg-zinc-900 shadow-[0_10px_28px_rgba(0,0,0,0.24)] transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-[5px]" key={value.title}>
            <h3 className="text-white text-xl mb-3">{value.title}</h3>
            <p className="text-zinc-300 leading-[1.7]">{value.text}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)] gap-[30px] items-center p-5 py-[34px] md:p-[34px] border border-white/5 rounded-xl md:rounded-2xl bg-gradient-to-br from-zinc-900/95 to-slate-900/95">
        <div>
          <span className="inline-flex items-center gap-2 text-orange-500 text-[0.82rem] font-bold tracking-[0.08em] mb-4 uppercase">Why Choose Us</span>
          <h2 className="mb-0">Premium service without making shopping complicated.</h2>
          <p className="mt-[18px] text-zinc-300 leading-[1.7]">
            NexCart is designed for people who want a clean store, responsive
            product discovery, and a buying experience they can trust from cart
            to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
          {stats.map((item) => (
            <div className="min-h-[118px] py-[22px] px-4 border border-white/5 rounded-xl bg-zinc-950/50 text-center" key={item.label}>
              <strong className="block text-teal-500 text-[1.65rem] mb-2">{item.value}</strong>
              <span className="text-zinc-400 text-[0.92rem]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
