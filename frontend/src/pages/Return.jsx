import React from "react";
import { Link } from "react-router-dom";

const policyStats = [
  { label: "Return Window", value: "7 days", note: "after delivery" },
  { label: "Refund Time", value: "2-5 days", note: "after approval" },
  { label: "Support", value: "Order ID", note: "needed for request" },
];

const returnFlow = [
  {
    title: "Send Your Request",
    text: "Email support with order number, delivery date, product name and return reason.",
  },
  {
    title: "Wait For Review",
    text: "Our team checks the request and shares the next step.",
  },
  {
    title: "Pack The Product",
    text: "Keep original tags, invoice, accessories and packaging ready.",
  },
  {
    title: "Refund Or Replacement",
    text: "After inspection, the approved refund or replacement is processed.",
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
    <main className="main-content">
      <section className="bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#2874f0]">Return Policy</p>
        <h1 className="mt-3 text-3xl font-semibold">NexCart Return Center</h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-600">
          Check the return window, keep your order details ready and follow the steps below.
        </p>
      </section>

      <section className="mt-5 grid gap-px bg-gray-200 shadow-sm md:grid-cols-3">
        {policyStats.map((stat) => (
          <article className="bg-white p-5" key={stat.label}>
            <span className="text-sm text-gray-500">{stat.label}</span>
            <strong className="mt-2 block text-2xl">{stat.value}</strong>
            <small className="mt-1 block text-gray-500">{stat.note}</small>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[310px_1fr]">
        <aside className="h-fit bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">Need help?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Contact support before sending any product back.
          </p>
          <div className="mt-5 border-l-4 border-[#2874f0] bg-blue-50 p-4">
            <p className="text-sm text-gray-500">Support email</p>
            <a href="mailto:support@nexcart.com" className="font-semibold text-[#2874f0]">
              support@nexcart.com
            </a>
          </div>
          <a href="mailto:support@nexcart.com" className="btn mt-5 w-full">
            Email Support
          </a>
          <Link to="/shop" className="mt-3 block text-center text-sm font-semibold text-[#2874f0]">
            Continue shopping
          </Link>
        </aside>

        <div className="grid gap-4">
          <section className="bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Return Process</h2>
            <div className="mt-5 grid gap-4">
              {returnFlow.map((step, index) => (
                <article className="grid grid-cols-[44px_1fr] gap-4" key={step.title}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#2874f0]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Accepted Returns</h2>
              <div className="mt-4 grid gap-2">
                {eligibleItems.map((item) => (
                  <p key={item} className="border-l-4 border-green-500 bg-green-50 p-3 text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Not Accepted</h2>
              <div className="mt-4 grid gap-2">
                {notEligibleItems.map((item) => (
                  <p key={item} className="border-l-4 border-red-500 bg-red-50 p-3 text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ReturnPolicy;
