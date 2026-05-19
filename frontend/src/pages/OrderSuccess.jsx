import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <main className="w-full max-w-[900px] mx-auto pt-[52px] px-5 pb-[76px]">
      <section className="grid justify-items-center gap-4 min-h-[430px] p-[54px_28px] text-center border border-white/5 rounded-[14px] bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <span className="text-teal-500 text-[0.78rem] font-extrabold tracking-[0.08em] uppercase">Order Placed</span>
        <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-0">Thank you for your order.</h1>
        <p className="max-w-[620px] text-zinc-300 leading-[1.7]">
          Your NexCart order has been created successfully. We will notify you
          when the order status changes.
        </p>

        {order?._id && (
          <div className="grid gap-2 w-full max-w-[560px] my-2 p-[18px] border border-white/5 rounded-lg bg-zinc-950/40">
            <span className="text-zinc-400">Order ID</span>
            <strong className="text-white break-words">{order._id}</strong>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3.5 mt-2">
          <Link to="/shop" className="btn">
            Continue Shopping
          </Link>
          <Link to="/" className="inline-flex items-center justify-center min-h-[46px] py-3 px-5 text-zinc-400 font-bold hover:text-orange-500">
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
