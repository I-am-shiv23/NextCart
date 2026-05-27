import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <main className="main-content">
      <section className="mx-auto grid min-h-96 max-w-3xl place-items-center bg-white p-8 text-center shadow-sm">
        <div>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
            OK
          </div>
          <h1 className="text-3xl font-semibold">Order placed successfully</h1>
          <p className="mt-3 text-gray-600">
            Thank you for shopping with NexCart. We will update your order status soon.
          </p>

          {order?._id && (
            <div className="mt-6 bg-[#f1f3f6] p-4 text-left">
              <p className="text-sm text-gray-500">Order ID</p>
              <strong className="break-words text-sm">{order._id}</strong>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn">
              Continue Shopping
            </Link>
            <Link to="/" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
