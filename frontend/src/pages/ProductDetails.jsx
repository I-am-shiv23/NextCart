import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { API_BASE_URL } from "../config";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        setProduct(data);
      } catch (err) {
        setError(err.message || "Product could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const productData = useMemo(() => {
    if (!product) return null;

    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    const imageUrl =
      product.imageUrl?.trim() || product.imageUri?.trim() || "/img/NextCartpng.png";

    return {
      ...product,
      price,
      stock,
      imageUrl,
      formattedPrice: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price),
      inStock: stock > 0,
    };
  }, [product]);

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value) || 1;
    const maxQuantity = productData?.stock || 1;
    setQuantity(Math.min(Math.max(value, 1), maxQuantity));
  };

  const handleAddToCart = () => {
    if (!productData?.inStock) return;

    dispatch(
      addToCart({
        ...productData,
        quantity,
      })
    );
    setSuccess(`${productData.name} added to cart.`);
  };

  if (loading) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <div className="grid place-items-center min-h-[320px] p-[34px] border border-white/5 rounded-[14px] bg-zinc-900 text-zinc-300 text-center">Loading product details...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <div className="grid place-items-center min-h-[320px] p-[34px] border border-white/5 rounded-[14px] bg-zinc-900 text-zinc-300 text-center gap-3.5">
          <h1 className="text-white mb-0 bg-none">Product unavailable</h1>
          <p className="text-zinc-300">{error}</p>
          <Link to="/shop" className="btn">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  if (!productData) {
    return null;
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <Link to="/shop" className="inline-flex text-zinc-400 font-bold mb-6 hover:text-orange-500">
        Back to shop
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] gap-9 items-start">
        <div className="grid place-items-center min-h-[420px] lg:min-h-[560px] p-[22px] sm:p-7 border border-white/5 rounded-[10px] sm:rounded-[14px] bg-[radial-gradient(circle_at_15%_15%,rgba(249,115,22,0.16),transparent_30%),linear-gradient(135deg,#18181b_0%,#111827_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
          <img src={productData.imageUrl} alt={productData.name} className="w-full max-h-[500px] rounded-lg object-contain" />
        </div>

        <div className="p-[22px] sm:p-[34px] border border-white/5 rounded-[10px] sm:rounded-[14px] bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-4 uppercase">{productData.category}</span>
          <h1 className="text-white text-[clamp(2rem,4vw,3.6rem)] leading-[1.08] mb-[18px] bg-none">{productData.name}</h1>

          <div className="flex flex-wrap gap-3 mb-[22px]">
            <span className="p-[9px_12px] border border-white/5 rounded-lg bg-[rgba(9,9,11,0.44)] text-zinc-300 text-[0.92rem]">{Number(productData.rating || 0).toFixed(1)} Rating</span>
            <span className="p-[9px_12px] border border-white/5 rounded-lg bg-[rgba(9,9,11,0.44)] text-zinc-300 text-[0.92rem]">{productData.numReviews || 0} Reviews</span>
          </div>

          <p className="text-orange-500 text-[2.35rem] font-extrabold mb-5">{productData.formattedPrice}</p>
          <p className="text-zinc-300 leading-[1.8] text-[1.05rem] mb-7">{productData.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
            <div className="min-h-[98px] p-4 border border-white/5 rounded-lg bg-[rgba(9,9,11,0.44)]">
              <span className="block text-zinc-400 text-[0.88rem] mb-2">Availability</span>
              <strong className={productData.inStock ? "text-teal-500 text-[1.05rem]" : "text-red-500 text-[1.05rem]"}>
                {productData.inStock ? "In Stock" : "Out of Stock"}
              </strong>
            </div>
            <div className="min-h-[98px] p-4 border border-white/5 rounded-lg bg-[rgba(9,9,11,0.44)]">
              <span className="block text-zinc-400 text-[0.88rem] mb-2">Stock</span>
              <strong className="text-zinc-50 text-[1.05rem]">{productData.stock}</strong>
            </div>
            <div className="min-h-[98px] p-4 border border-white/5 rounded-lg bg-[rgba(9,9,11,0.44)]">
              <span className="block text-zinc-400 text-[0.88rem] mb-2">Category</span>
              <strong className="text-zinc-50 text-[1.05rem]">{productData.category}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-3.5 sm:items-end">
            <label className="grid gap-2 text-zinc-50 font-bold">
              Quantity
              <input
                type="number"
                min="1"
                max={Math.max(productData.stock, 1)}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={!productData.inStock}
                className="min-h-[50px] p-3 border border-zinc-800 rounded-lg bg-zinc-950 text-zinc-50 text-[1rem] outline-none focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              />
            </label>

            <button
              type="button"
              className="btn min-h-[50px] disabled:cursor-not-allowed disabled:opacity-[0.65] disabled:transform-none"
              onClick={handleAddToCart}
              disabled={!productData.inStock}
            >
              {productData.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {success && <div className="mt-[18px] p-[14px_16px] border border-teal-500/35 rounded-lg bg-teal-500/12 text-teal-100 font-bold">{success}</div>}
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
