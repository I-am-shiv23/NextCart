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

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateCartQuantity({ id, quantity }));
  };

  if (cartItems.length === 0) {
    return (
      <main className="main-content">
        <section className="grid min-h-96 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            <p className="mt-2 text-gray-600">Add items to it now and continue shopping.</p>
            <Link to="/shop" className="btn mt-5">
              Shop Now
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <h1 className="text-xl font-semibold">My Cart ({totalItems})</h1>
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="text-sm font-semibold text-red-600"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y">
            {cartItems.map((item) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const stock = Number(item.stock) || quantity;
              const imageUrl =
                item.imageUrl?.trim() || item.imageUri?.trim() || "/img/NextCartpng.png";

              return (
                <article className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]" key={item._id}>
                  <Link to={`/product/${item._id}`} className="flex h-32 items-center justify-center border border-gray-100">
                    <img src={imageUrl} alt={item.name} className="h-full w-full object-contain" />
                  </Link>

                  <div className="grid gap-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <Link to={`/product/${item._id}`}>
                          <h2 className="font-semibold hover:text-[#2874f0]">{item.name}</h2>
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{item.category || "Product"}</p>
                        <p className="mt-2 text-lg font-semibold">{formatCurrency(price)}</p>
                        <p className="text-sm font-semibold text-green-600">Delivery by tomorrow</p>
                      </div>
                      <strong className="text-lg">{formatCurrency(price * quantity)}</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item._id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="h-8 w-8 rounded-full border border-gray-300 text-lg disabled:text-gray-300"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={stock}
                          value={quantity}
                          className="h-8 w-14 rounded border border-gray-300 text-center text-sm outline-none"
                          onChange={(event) =>
                            handleQuantityChange(item._id, event.target.value)
                          }
                          aria-label={`Quantity for ${item.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item._id, quantity + 1)}
                          disabled={quantity >= stock}
                          className="h-8 w-8 rounded-full border border-gray-300 text-lg disabled:text-gray-300"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="text-sm font-semibold uppercase text-gray-700 hover:text-red-600"
                        onClick={() => dispatch(removeFromCart(item._id))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex justify-end border-t p-4">
            <Link to="/checkout" className="rounded-sm bg-[#fb641b] px-10 py-3 text-sm font-semibold uppercase text-white">
              Place Order
            </Link>
          </div>
        </div>

        <aside className="h-fit bg-white shadow-sm lg:sticky lg:top-24">
          <h2 className="border-b px-4 py-4 text-lg font-semibold uppercase text-gray-500">
            Price Details
          </h2>
          <div className="grid gap-3 p-4 text-sm">
            <div className="flex justify-between">
              <span>Price ({totalItems} items)</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">
                {totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-y py-4 text-base font-semibold">
              <span>Total Amount</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
            <p className="font-semibold text-green-600">You will save on free delivery above Rs. 500.</p>
          </div>
          <Link to="/shop" className="block border-t p-4 text-center text-sm font-semibold text-[#2874f0]">
            Continue Shopping
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default Cart;
