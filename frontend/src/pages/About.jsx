import React from "react";
import { Link } from "react-router-dom";

const values = [
  {
    title: "Good Products",
    text: "We keep the store focused on products that are useful for everyday shopping.",
  },
  {
    title: "Simple Browsing",
    text: "Categories, search and product pages are kept clean so customers can move fast.",
  },
  {
    title: "Customer Support",
    text: "NexCart keeps returns, order history and checkout easy to understand.",
  },
];

const stats = [
  { value: "500+", label: "Products" },
  { value: "24/7", label: "Support" },
  { value: "99%", label: "Secure checkout" },
];

const About = () => {
  return (
    <main className="main-content">
      <section className="grid gap-5 bg-white p-6 shadow-sm lg:grid-cols-[1fr_320px] lg:p-10">
        <div>
          <p className="text-sm font-semibold uppercase text-[#2874f0]">About NexCart</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Built for simple and confident online shopping.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            NexCart brings electronics, fashion, home, kitchen, beauty and fitness products
            into one clean ecommerce experience with clear prices and quick checkout.
          </p>
          <Link to="/shop" className="btn mt-6">
            Explore Products
          </Link>
        </div>

        <div className="flex items-center justify-center bg-blue-50 p-6">
          <img src="/img/NextCartpng.png" alt="NexCart logo" className="max-h-56 object-contain" />
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <article className="bg-white p-5 shadow-sm" key={value.title}>
            <h2 className="text-xl font-semibold">{value.title}</h2>
            <p className="mt-3 leading-6 text-gray-600">{value.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-4 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-[#2874f0]">Why choose us</p>
          <h2 className="mt-2 text-2xl font-semibold">A store that feels familiar and easy.</h2>
          <p className="mt-3 leading-7 text-gray-600">
            NexCart is designed like a real shopping marketplace: quick categories, clear
            product cards, helpful price details and a checkout flow that does not feel confusing.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div className="bg-[#f1f3f6] p-5 text-center" key={item.label}>
              <strong className="block text-2xl text-[#2874f0]">{item.value}</strong>
              <span className="mt-2 block text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
