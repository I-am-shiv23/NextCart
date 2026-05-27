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
    const shipping = subtotal > 0 && subtotal < 500 ? 49 : 0;
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

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "NexCart",
        description: "Order Payment",
        order_id: order.id,
        prefill: {
          name: address.fullName,
          email: user?.email || "",
        },
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
          color: "#2874f0",
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
      <main className="main-content">
        <section className="grid min-h-96 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            <p className="mt-2 text-gray-600">Add products to your cart before checkout.</p>
            <Link to="/shop" className="btn mt-5">
              Shop Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <form className="bg-white shadow-sm" onSubmit={handleSubmit}>
          <div className="border-b px-5 py-4">
            <h1 className="text-xl font-semibold">Checkout</h1>
            <p className="mt-1 text-sm text-gray-600">Add delivery details and pay securely.</p>
          </div>

          {!user?.token && (
            <div className="m-5 flex flex-col gap-3 rounded border border-yellow-200 bg-yellow-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-yellow-800">Please login before placing order.</p>
              <Link to="/login" className="rounded bg-[#2874f0] px-4 py-2 text-sm font-semibold text-white">
                Login
              </Link>
            </div>
          )}

          <div className="grid gap-4 p-5">
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <h2 className="text-lg font-semibold">Delivery Address</h2>

            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Full Name
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="h-11 rounded border border-gray-300 px-3 text-sm font-normal outline-none focus:border-[#2874f0]"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Street Address
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="House number, street, area"
                required
                className="h-11 rounded border border-gray-300 px-3 text-sm font-normal outline-none focus:border-[#2874f0]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-gray-700">
                City
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="h-11 rounded border border-gray-300 px-3 text-sm font-normal outline-none focus:border-[#2874f0]"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-gray-700">
                Postal Code
                <input
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  required
                  className="h-11 rounded border border-gray-300 px-3 text-sm font-normal outline-none focus:border-[#2874f0]"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Country
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className="h-11 rounded border border-gray-300 px-3 text-sm font-normal outline-none focus:border-[#2874f0]"
              />
            </label>

            <div className="rounded border border-blue-100 bg-blue-50 p-4">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <p className="mt-1 text-sm text-gray-600">Pay online with Razorpay after clicking place order.</p>
            </div>
          </div>

          <div className="flex justify-end border-t p-5">
            <button
              type="submit"
              disabled={loading || !user?.token}
              className="rounded-sm bg-[#fb641b] px-10 py-3 text-sm font-semibold uppercase text-white disabled:bg-gray-300"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>

        <aside className="h-fit bg-white shadow-sm lg:sticky lg:top-24">
          <h2 className="border-b px-4 py-4 text-lg font-semibold uppercase text-gray-500">
            Order Summary
          </h2>

          <div className="grid gap-3 border-b p-4">
            {cartItems.map((item) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const imageUrl =
                item.imageUrl?.trim() || item.imageUri?.trim() || "/img/NextCartpng.png";

              return (
                <article className="grid grid-cols-[56px_1fr_auto] gap-3" key={item._id}>
                  <img src={imageUrl} alt={item.name} className="h-14 w-14 border object-contain" />
                  <div>
                    <h3 className="line-clamp-1 text-sm font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {quantity} x {formatCurrency(price)}
                    </p>
                  </div>
                  <strong className="text-sm">{formatCurrency(price * quantity)}</strong>
                </article>
              );
            })}
          </div>

          <div className="grid gap-3 p-4 text-sm">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">
                {totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-y py-4 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
            <Link to="/cart" className="text-center text-sm font-semibold text-[#2874f0]">
              Back to Cart
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Checkout;
