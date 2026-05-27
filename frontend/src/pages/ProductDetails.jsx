import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { API_BASE_URL } from "../config";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value) || 0);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      oldPrice: Math.round(price + price * 0.18),
      inStock: stock > 0,
    };
  }, [product]);

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value) || 1;
    const maxQuantity = productData?.stock || 1;
    setQuantity(Math.min(Math.max(value, 1), maxQuantity));
  };

  const addProductToCart = () => {
    if (!productData?.inStock) return false;

    dispatch(
      addToCart({
        ...productData,
        quantity,
      })
    );
    setSuccess(`${productData.name} added to cart.`);
    return true;
  };

  const handleAddToCart = () => {
    addProductToCart();
  };

  const handleBuyNow = () => {
    const added = addProductToCart();
    if (added) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <main className="main-content">
        <div className="grid min-h-80 place-items-center bg-white p-8 shadow-sm text-gray-600">
          Loading product details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <div className="grid min-h-80 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">Product unavailable</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <Link to="/shop" className="btn mt-5">
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!productData) {
    return null;
  }

  return (
    <main className="main-content">
      <Link to="/shop" className="mb-4 inline-flex text-sm font-semibold text-[#2874f0]">
        Back to products
      </Link>

      <section className="grid gap-4 lg:grid-cols-[430px_1fr]">
        <div className="bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="flex min-h-96 items-center justify-center border border-gray-100 p-4">
            <img src={productData.imageUrl} alt={productData.name} className="max-h-[430px] w-full object-contain" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!productData.inStock}
              className="rounded-sm bg-[#ff9f00] px-4 py-4 text-sm font-semibold uppercase text-white disabled:bg-gray-300"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!productData.inStock}
              className="rounded-sm bg-[#fb641b] px-4 py-4 text-sm font-semibold uppercase text-white disabled:bg-gray-300"
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm text-gray-500">{productData.category}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-snug text-gray-900">
            {productData.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white">
              {Number(productData.rating || 4.2).toFixed(1)} *
            </span>
            <span className="text-sm font-semibold text-gray-500">
              {productData.numReviews || 0} Ratings and Reviews
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-green-600">Special price</p>
          <div className="mt-1 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-semibold">{formatCurrency(productData.price)}</span>
            <span className="text-lg text-gray-400 line-through">
              {formatCurrency(productData.oldPrice)}
            </span>
            <span className="text-base font-semibold text-green-600">18% off</span>
          </div>

          <div className="mt-6 border-t pt-5">
            <h2 className="text-lg font-semibold">Available offers</h2>
            <ul className="mt-3 grid gap-2 text-sm text-gray-700">
              <li><span className="font-semibold text-green-700">Bank Offer</span> 10% instant discount on selected cards.</li>
              <li><span className="font-semibold text-green-700">Free Delivery</span> on prepaid orders above Rs. 499.</li>
              <li><span className="font-semibold text-green-700">Partner Offer</span> Extra savings on your first NexCart order.</li>
            </ul>
          </div>

          <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className={productData.inStock ? "mt-1 font-semibold text-green-700" : "mt-1 font-semibold text-red-600"}>
                {productData.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="mt-1 font-semibold">{productData.stock}</p>
            </div>
            <label className="text-sm font-semibold text-gray-700">
              Quantity
              <input
                type="number"
                min="1"
                max={Math.max(productData.stock, 1)}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={!productData.inStock}
                className="mt-2 h-10 w-full rounded border border-gray-300 px-3 outline-none focus:border-[#2874f0]"
              />
            </label>
          </div>

          <div className="mt-6 border-t pt-5">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 leading-7 text-gray-700">{productData.description}</p>
          </div>

          {success && (
            <div className="mt-5 rounded border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
              {success}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
