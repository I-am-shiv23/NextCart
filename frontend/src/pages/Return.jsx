import React from "react";
import { Link } from "react-router-dom";

const policyStats = [
  { label: "Window", value: "7 days", note: "after delivery" },
  { label: "Refund", value: "2-5 days", note: "after approval" },
  { label: "Support", value: "Order ID", note: "required" },
];

const returnFlow = [
  {
    title: "Send Your Request",
    text: "Email support with your order number, delivery date, item name, and return reason.",
  },
  {
    title: "Wait For Review",
    text: "Our team confirms whether the product qualifies and shares the next instruction.",
  },
  {
    title: "Prepare The Package",
    text: "Keep the item unused and include original tags, packaging, invoice, and accessories.",
  },
  {
    title: "Refund Or Replacement",
    text: "After inspection, NexCart processes the approved refund or replacement request.",
  },
];

const eligibleItems = [
  "Unused product",
  "Original packaging",
  "Tags attached",
  "Invoice available",
];

const notEligibleItems = [
  "Used or damaged item",
  "Missing accessories",
  "Final sale product",
  "Late request",
];

const ReturnPolicy = () => {
  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[68px]">
      <section className="grid grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)] gap-[34px] items-start py-[28px] border-b border-white/5">
        <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] uppercase">Return Policy</span>
        <div>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4.4rem)] leading-none mb-[18px]">NexCart Return Center</h1>
          <p className="max-w-[700px] text-[1.1rem] text-zinc-300 leading-[1.7]">
            Check the return window, prepare the right details, and follow the
            process without guessing what comes next.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-px my-[32px] overflow-hidden border border-white/5 rounded-[10px] bg-white/5" aria-label="Return policy summary">
        {policyStats.map((stat) => (
          <article className="min-h-[132px] p-[24px] bg-zinc-900" key={stat.label}>
            <span className="block text-zinc-400">{stat.label}</span>
            <strong className="block text-white text-[1.8rem] my-3">{stat.value}</strong>
            <small className="block text-zinc-400 text-[0.92rem]">{stat.note}</small>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-7 items-start">
        <aside className="lg:sticky lg:top-[112px] flex flex-col gap-[26px] p-[24px_20px] sm:p-[28px] border border-white/5 rounded-[10px] bg-[linear-gradient(160deg,rgba(24,24,27,0.98),rgba(15,23,42,0.98))] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <div>
            <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] uppercase">Start Here</span>
            <h2 className="text-white text-[1.65rem] my-3.5 bg-none">Need to return an item?</h2>
            <p className="text-zinc-300 leading-[1.7]">
              Keep your order details ready and contact support before shipping
              the product back.
            </p>
          </div>

          <div className="p-[18px] border-l-[3px] border-teal-500 bg-[rgba(9,9,11,0.48)]">
            <span className="block text-zinc-400">Support email</span>
            <a href="mailto:support@nexcart.com" className="inline-flex text-teal-500 font-bold mt-2 break-words">support@nexcart.com</a>
          </div>

          <div className="grid gap-3">
            <a href="mailto:support@nexcart.com" className="btn">
              Email Support
            </a>
            <Link to="/shop" className="inline-flex justify-center text-zinc-50 font-bold p-3 border border-white/10 rounded-lg hover:border-orange-500/55 hover:text-orange-500">
              Continue shopping
            </Link>
          </div>
        </aside>

        <div className="flex flex-col gap-7">
          <section className="p-[24px_20px] sm:p-[30px] border border-white/5 rounded-[10px] bg-zinc-900">
            <div className="block lg:flex lg:justify-between gap-7 lg:items-end mb-[26px]">
              <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] uppercase">Process</span>
              <h2 className="max-w-[560px] mb-0 text-left lg:text-right mt-3 lg:mt-0 bg-none text-white text-[1.5rem]">Four steps from request to resolution</h2>
            </div>

            <ol className="grid gap-0">
              {returnFlow.map((step, index) => (
                <li className="grid grid-cols-[52px_minmax(0,1fr)] sm:grid-cols-[72px_minmax(0,1fr)] gap-5 pb-7 relative group" key={step.title}>
                  <div className="absolute left-[19px] top-[40px] bottom-0 w-[2px] bg-white/10 sm:left-[22px] sm:top-[46px] group-last:hidden"></div>
                  <span className="grid place-items-center w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-full bg-[rgba(249,115,22,0.13)] text-orange-500 font-extrabold relative z-10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-white text-[1.2rem] mb-2">{step.title}</h3>
                    <p className="text-zinc-300 leading-[1.7]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-px p-0 overflow-hidden rounded-[10px] bg-white/5 border border-white/5">
            <div className="p-[24px_20px] sm:p-[30px] bg-zinc-900">
              <h2 className="text-white text-[1.35rem] mb-[22px] bg-none">Accepted Returns</h2>
              <ul className="grid gap-3">
                {eligibleItems.map((item) => (
                  <li key={item} className="text-zinc-300 p-[14px_16px] rounded-lg bg-[rgba(9,9,11,0.44)] border-l-[3px] border-teal-500">{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-[24px_20px] sm:p-[30px] bg-zinc-900">
              <h2 className="text-white text-[1.35rem] mb-[22px] bg-none">Not Accepted</h2>
              <ul className="grid gap-3">
                {notEligibleItems.map((item) => (
                  <li key={item} className="text-zinc-300 p-[14px_16px] rounded-lg bg-[rgba(9,9,11,0.44)] border-l-[3px] border-red-500">{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ReturnPolicy;
