import React from "react";

const disclaimerSections = [
  {
    id: "information",
    title: "General Information",
    text: "The content on NexCart is for shopping and product discovery. We try to keep details correct, but information may change without notice.",
  },
  {
    id: "products",
    title: "Product Details",
    text: "Images, descriptions, availability, prices and offers can change. Please review final product details before placing an order.",
  },
  {
    id: "external",
    title: "External Links",
    text: "NexCart may use third party services. We are not responsible for external websites or their business practices.",
  },
  {
    id: "liability",
    title: "Limitation Of Liability",
    text: "NexCart is not liable for indirect loss, delay or issues caused by incorrect customer details, payment providers or delivery partners.",
  },
];

const quickNotes = [
  "Review order details before payment.",
  "Product availability can change.",
  "Delivery timelines are estimates.",
  "Policies may be updated when needed.",
];

const Disclaimer = () => {
  return (
    <main className="main-content">
      <header className="bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase text-[#2874f0]">Legal Notice</p>
        <h1 className="mt-3 text-3xl font-semibold">Disclaimer</h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-600">
          Please read this page to understand how NexCart presents product information,
          external services and ecommerce-related responsibility.
        </p>
      </header>

      <section className="mt-5 grid gap-4 lg:grid-cols-[270px_1fr]">
        <aside className="h-fit bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">On this page</h2>
          <nav className="mt-4 grid gap-2">
            {disclaimerSections.map((section) => (
              <a
                href={`#${section.id}`}
                key={section.id}
                className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
              >
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-5 border-l-4 border-[#2874f0] bg-blue-50 p-4">
            <p className="text-sm text-gray-500">Last updated</p>
            <strong>May 15, 2026</strong>
          </div>
        </aside>

        <div className="grid gap-4">
          <section className="bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Important shopping note</h2>
            <p className="mt-2 leading-7 text-gray-600">
              NexCart aims to provide a smooth shopping experience, but customers should
              confirm product, pricing and delivery details before completing orders.
            </p>
          </section>

          {disclaimerSections.map((section, index) => (
            <article
              className="scroll-mt-28 bg-white p-5 shadow-sm"
              id={section.id}
              key={section.id}
            >
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-50 font-semibold text-[#2874f0]">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="mt-2 leading-7 text-gray-600">{section.text}</p>
                </div>
              </div>
            </article>
          ))}

          <section className="bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Quick reminders</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {quickNotes.map((note) => (
                <p key={note} className="border-l-4 border-[#2874f0] bg-blue-50 p-3 text-sm">
                  {note}
                </p>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Disclaimer;
