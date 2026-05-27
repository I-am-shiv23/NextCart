import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const price = Number(product.price) || 0;
  const oldPrice = Math.round(price + price * 0.18);
  const imageUrl = product.imageUrl || product.imageUri || "/img/NextCartpng.png";

  return (
    <div className="group flex h-full flex-col bg-white p-3 shadow-sm hover:shadow-md">
      <Link to={`/product/${product._id}`} className="flex h-48 items-center justify-center overflow-hidden bg-white">
        <img
          src={imageUrl}
          alt={product.name}
          className="max-h-full w-full object-contain duration-200 group-hover:scale-105"
        />
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="mb-1 text-xs text-gray-500">{product.category || "Product"}</p>

        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-800 hover:text-[#2874f0]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
            {Number(product.rating || 4.2).toFixed(1)} *
          </span>
          <span className="text-xs text-gray-400">({product.numReviews || 10})</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">Rs. {price.toFixed(0)}</span>
          <span className="text-sm text-gray-400 line-through">Rs. {oldPrice}</span>
          <span className="text-sm font-semibold text-green-600">18% off</span>
        </div>

        <p className="mt-1 text-xs font-semibold text-green-700">Free delivery</p>

        <Link
          to={`/product/${product._id}`}
          className="mt-4 rounded-sm border border-[#2874f0] py-2 text-center text-sm font-semibold text-[#2874f0] hover:bg-blue-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
