import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeFromCart,
  updateCartQuantity,
} from "../redux/cartSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

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

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateCartQuantity({ id, quantity }));
  };

  if (cartItems.length === 0) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[420px] p-[52px_24px] text-center border border-white/5 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.18),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Your Cart</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-3.5">Your cart is empty.</h1>
          <p className="max-w-[680px] text-zinc-300 leading-[1.7]">
            Browse NexCart products and add your favorites here when you are
            ready to buy.
          </p>
          <Link to="/shop" className="btn">
            Start Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <header className="grid sm:flex sm:justify-between gap-6 sm:items-end mb-[30px] pb-[28px] border-b border-white/5">
        <div>
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Shopping Cart</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-3.5">Your Cart</h1>
          <p className="max-w-[680px] text-zinc-300 leading-[1.7]">
            Review your selected items, adjust quantities, and remove anything
            you no longer need.
          </p>
        </div>
        <button
          type="button"
          className="min-h-[44px] py-2.5 px-4 border border-red-500/35 rounded-lg bg-transparent text-red-300 font-bold transition-all duration-300 hover:border-red-500 hover:bg-red-500/10 cursor-pointer"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-7 items-start">
        <div className="grid gap-4">
          {cartItems.map((item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const stock = Number(item.stock) || quantity;
            const imageUrl =
              item.imageUrl?.trim() || item.imageUri?.trim() || "/img/NextCartpng.png";

            return (
              <article className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] md:grid-cols-[118px_minmax(0,1fr)_150px_130px] gap-5 items-center p-[18px] border border-white/5 rounded-xl bg-zinc-900 shadow-[0_10px_28px_rgba(0,0,0,0.22)]" key={item._id}>
                <Link to={`/product/${item._id}`} className="grid place-items-center w-full sm:w-[100px] md:w-[118px] max-h-[240px] md:max-h-none aspect-square rounded-lg overflow-hidden bg-zinc-950">
                  <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                <div>
                  <span className="inline-flex text-orange-500 text-[0.76rem] font-bold tracking-[0.08em] mb-2 uppercase">{item.category || "Product"}</span>
                  <Link to={`/product/${item._id}`}>
                    <h2 className="text-white text-[1.2rem] mb-2 bg-none">{item.name}</h2>
                  </Link>
                  <p className="text-zinc-300 font-bold">{formatCurrency(price)}</p>
                </div>

                <div className="grid grid-cols-[38px_1fr_38px] items-center border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 sm:col-start-2 md:col-start-auto">
                  <button
                    type="button"
                    className="min-h-[42px] border-none bg-transparent text-zinc-50 text-center font-bold outline-none cursor-pointer transition-all duration-300 hover:not(:disabled):bg-orange-500/15 hover:not(:disabled):text-orange-500 disabled:text-zinc-500 disabled:cursor-not-allowed"
                    onClick={() => handleQuantityChange(item._id, quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={stock}
                    value={quantity}
                    className="min-h-[42px] border-none bg-transparent text-zinc-50 text-center font-bold outline-none"
                    onChange={(event) =>
                      handleQuantityChange(item._id, event.target.value)
                    }
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    type="button"
                    className="min-h-[42px] border-none bg-transparent text-zinc-50 text-center font-bold outline-none cursor-pointer transition-all duration-300 hover:not(:disabled):bg-orange-500/15 hover:not(:disabled):text-orange-500 disabled:text-zinc-500 disabled:cursor-not-allowed"
                    onClick={() => handleQuantityChange(item._id, quantity + 1)}
                    disabled={quantity >= stock}
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <div className="grid justify-items-start md:justify-items-end gap-2.5 sm:col-start-2 md:col-start-auto">
                  <strong className="text-white text-[1.05rem]">{formatCurrency(price * quantity)}</strong>
                  <button
                    type="button"
                    className="border-none bg-transparent text-red-300 font-bold cursor-pointer hover:text-red-500"
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-[112px] p-[26px] border border-white/5 rounded-xl bg-[radial-gradient(circle_at_90%_10%,rgba(20,184,166,0.12),transparent_30%),#18181b] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <h2 className="text-white text-[1.55rem] mb-5 bg-none">Order Summary</h2>

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

          <div className="flex justify-between items-center gap-4 mt-[10px] mb-[20px] text-white font-extrabold">
            <span>Total</span>
            <strong className="text-orange-500 text-[1.6rem]">{formatCurrency(totals.total)}</strong>
          </div>

          <Link to="/checkout" className="btn inline-flex items-center justify-center w-full min-h-[50px]">
            Checkout
          </Link>
          <Link to="/shop" className="inline-flex justify-center w-full mt-3 p-3 text-zinc-400 font-bold hover:text-orange-500">
            Continue Shopping
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default Cart;
