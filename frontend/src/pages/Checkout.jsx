import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import { API_BASE_URL } from "../config";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);
    const shipping = subtotal > 0 && subtotal < 100 ? 6.99 : 0;
    const tax = subtotal * 0.08;

    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  }, [cartItems]);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const createOrderAfterPayment = async (response) => {
    const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(response),
    });
    const verifyData = await verifyRes.json().catch(() => ({}));

    if (!verifyRes.ok) {
      throw new Error(verifyData.message || "Payment verification failed.");
    }

    const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity) || 1,
        })),
        totalAmount: Number(totals.total.toFixed(2)),
        address,
        paymentId: response.razorpay_payment_id,
      }),
    });
    const orderData = await orderRes.json().catch(() => ({}));

    if (!orderRes.ok) {
      throw new Error(orderData.message || "Order could not be created after payment.");
    }

    dispatch(clearCart());
    navigate("/order-success", { state: { order: orderData.order } });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.token) {
      setError("Please login before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay checkout is not loaded. Please refresh the page and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount: totals.total }),
      });
      const order = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(order.message || `Request failed with status ${res.status}`);
      }

      if (!order.id || !order.keyId) {
        throw new Error("Payment order could not be started. Razorpay order details are missing.");
      }

      const prefill = {
        name: address.fullName,
        email: user?.email || "",
      };

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "NexCart",
        description: "Order Payment",
        order_id: order.id,
        prefill,
        config: {
          display: {
            blocks: {
              upi_collect: {
                name: "Pay with UPI ID",
                instruments: [
                  {
                    method: "upi",
                    flows: ["collect"],
                  },
                ],
              },
              upi_qr: {
                name: "UPI QR",
                instruments: [
                  {
                    method: "upi",
                    flows: ["qr"],
                  },
                ],
              },
            },
            sequence: ["block.upi_collect", "block.upi_qr", "card", "netbanking", "wallet"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response) {
          try {
            await createOrderAfterPayment(response);
          } catch (err) {
            setError(err.message || "Payment was successful, but order creation failed.");
            setLoading(false);
          }
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment could not be initiated.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[420px] p-[52px_24px] text-center border border-white/5 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.18),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.26)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Checkout</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-3.5">Your cart is empty.</h1>
          <p className="text-zinc-300 leading-[1.7]">Add products to your cart before starting checkout.</p>
          <Link to="/shop" className="btn">
            Shop Products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <header className="max-w-[760px] mb-7">
        <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Secure Checkout</span>
        <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-3.5">Complete your order</h1>
        <p className="text-zinc-300 leading-[1.7]">
          Add your shipping details, review the order summary, and place your
          NexCart order.
        </p>
      </header>

      {!user?.token && (
        <section className="flex flex-col sm:flex-row sm:justify-between gap-5 items-center p-5 mb-6 border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)]">
          <div>
            <strong className="block text-white mb-1.5">Login required</strong>
            <span className="text-zinc-300">You need an account before placing an order.</span>
          </div>
          <Link to="/login" className="btn">
            Login
          </Link>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-7 items-start">
        <form className="grid gap-4 sm:gap-[18px] p-[22px] sm:p-8 border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)]" onSubmit={handleSubmit}>
          <div>
            <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Shipping Address</span>
            <h2 className="text-white text-[1.55rem] mb-0 bg-none">Where should we deliver?</h2>
          </div>

          {error && <div className="p-[13px_15px] border border-red-500/35 rounded-lg bg-red-500/12 text-red-200 font-bold leading-[1.5]">{error}</div>}

          <label className="grid gap-2 text-zinc-50 font-bold">
            Full Name
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <label className="grid gap-2 text-zinc-50 font-bold">
            Street Address
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="House number, street, area"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="grid gap-2 text-zinc-50 font-bold">
              City
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              />
            </label>

            <label className="grid gap-2 text-zinc-50 font-bold">
              Postal Code
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
                required
                className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              />
            </label>
          </div>

          <label className="grid gap-2 text-zinc-50 font-bold">
            Country
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="Country"
              required
              className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 text-[1rem] transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
            />
          </label>

          <section className="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] gap-[18px] p-5 border border-white/5 rounded-lg bg-zinc-950/40">
            <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Payment</span>
            <div>
              <strong className="text-white">Razorpay</strong>
              <p className="text-zinc-300 leading-[1.7]">Pay securely online before your order is placed.</p>
            </div>
          </section>

          <button
            type="submit"
            className="btn min-h-[50px] mt-1 disabled:cursor-not-allowed disabled:opacity-[0.65] disabled:transform-none"
            disabled={loading || !user?.token}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="lg:sticky lg:top-[112px] p-[22px] sm:p-[26px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)]">
          <h2 className="text-white text-[1.55rem] mb-0 bg-none">Order Summary</h2>

          <div className="grid gap-3.5 my-[22px]">
            {cartItems.map((item) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const imageUrl =
                item.imageUrl?.trim() || item.imageUri?.trim() || "/img/NextCartpng.png";

              return (
                <article className="grid grid-cols-[58px_minmax(0,1fr)_auto] gap-3 items-center" key={item._id}>
                  <img src={imageUrl} alt={item.name} className="w-[58px] h-[58px] rounded-lg object-cover bg-zinc-950" />
                  <div>
                    <h3 className="text-white text-[0.98rem] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</h3>
                    <span className="text-zinc-400 text-[0.9rem]">
                      {quantity} x {formatCurrency(price)}
                    </span>
                  </div>
                  <strong className="text-white">{formatCurrency(price * quantity)}</strong>
                </article>
              );
            })}
          </div>

          <div className="flex justify-between gap-4 py-[13px] text-zinc-300 border-b border-white/5">
            <span>Items</span>
            <strong className="text-white">{totalItems}</strong>
          </div>
          <div className="flex justify-between gap-4 py-[13px] text-zinc-300 border-b border-white/5">
            <span>Subtotal</span>
            <strong className="text-white">{formatCurrency(totals.subtotal)}</strong>
          </div>
          <div className="flex justify-between gap-4 py-[13px] text-zinc-300 border-b border-white/5">
            <span>Shipping</span>
            <strong className="text-white">
              {totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}
            </strong>
          </div>
          <div className="flex justify-between gap-4 py-[13px] text-zinc-300 border-b border-white/5">
            <span>Estimated Tax</span>
            <strong className="text-white">{formatCurrency(totals.tax)}</strong>
          </div>
          <div className="flex justify-between items-center gap-4 my-[10px] mb-4 text-white font-extrabold">
            <span>Total</span>
            <strong className="text-orange-500 text-[1.6rem]">{formatCurrency(totals.total)}</strong>
          </div>

          <Link to="/cart" className="inline-flex justify-center w-full p-3 text-zinc-400 font-bold hover:text-orange-500">
            Back to cart
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default Checkout;
