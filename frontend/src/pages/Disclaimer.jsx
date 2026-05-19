import React from "react";

const disclaimerSections = [
  {
    id: "information",
    title: "General Information",
    text: "The content on NexCart is provided for general shopping and product discovery purposes. We work to keep product details accurate, but information may change without notice.",
  },
  {
    id: "products",
    title: "Product Details",
    text: "Images, descriptions, availability, prices, and offers may vary from time to time. Final product details should be reviewed before completing your order.",
  },
  {
    id: "external",
    title: "External Links",
    text: "NexCart may include links or references to third-party services. We are not responsible for external websites, their content, or their privacy and business practices.",
  },
  {
    id: "liability",
    title: "Limitation Of Liability",
    text: "NexCart is not liable for indirect losses, delays, interruptions, or issues caused by incorrect information provided by customers, payment providers, delivery partners, or external systems.",
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
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[68px]">
      <header className="pt-[38px] pb-[34px] border-b border-white/5">
        <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-4 uppercase">Legal Notice</span>
        <h1 className="text-white text-[clamp(2.4rem,6vw,5rem)] leading-none mb-[18px]">Disclaimer</h1>
        <p className="max-w-[760px] text-[1.1rem] text-zinc-300 leading-[1.7]">
          Please read this page to understand how NexCart presents product
          information, handles external references, and limits responsibility
          for certain ecommerce-related situations.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-[30px] items-start mt-8">
        <aside className="lg:sticky lg:top-[112px] p-6 border border-white/5 rounded-lg bg-zinc-900" aria-label="Disclaimer overview">
          <h2 className="text-white text-[1.1rem] mb-[18px] bg-none">On this page</h2>
          <nav className="grid gap-2">
            {disclaimerSections.map((section) => (
              <a href={`#${section.id}`} key={section.id} className="text-zinc-400 py-[11px] px-3 rounded-lg hover:text-white hover:bg-orange-500/12">
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-6 p-4 border-l-[3px] border-teal-500 bg-zinc-950/50">
            <span className="block text-zinc-400 text-[0.9rem] mb-1.5">Last updated</span>
            <strong className="text-teal-500">May 15, 2026</strong>
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <section className="p-7 border border-white/5 rounded-lg bg-[radial-gradient(circle_at_95%_20%,rgba(20,184,166,0.14),transparent_30%),linear-gradient(135deg,#18181b_0%,#111827_100%)]">
            <h2 className="text-white text-[1.35rem] mb-3 bg-none">Important shopping note</h2>
            <p className="text-zinc-300 leading-[1.7]">
              NexCart aims to provide a smooth and reliable shopping experience,
              but customers should confirm product, pricing, and delivery
              details before placing an order.
            </p>
          </section>

          <section className="grid gap-4">
            {disclaimerSections.map((section, index) => (
              <article
                className="grid grid-cols-1 sm:grid-cols-[64px_minmax(0,1fr)] gap-[18px] p-[22px] sm:p-[26px] scroll-mt-[120px] border border-white/5 rounded-lg bg-zinc-900"
                id={section.id}
                key={section.id}
              >
                <span className="grid place-items-center w-[46px] h-[46px] rounded-lg bg-orange-500/12 text-orange-500 font-extrabold">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-white text-[1.35rem] mb-3 bg-none">{section.title}</h2>
                  <p className="text-zinc-300 leading-[1.7]">{section.text}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="p-[26px] border border-white/5 rounded-lg bg-zinc-900">
            <h2 className="text-white text-[1.35rem] mb-3 bg-none">Quick reminders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickNotes.map((note) => (
                <span key={note} className="text-zinc-300 py-[14px] px-4 border-l-[3px] border-orange-500 rounded-lg bg-zinc-950/40">{note}</span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Disclaimer;
