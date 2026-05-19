import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const price = Number(product.price) || 0;
  const imageUrl = product.imageUrl || product.imageUri || "/img/NextCartpng.png";

  return (
    <div className="flex flex-col bg-zinc-900 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] border border-white/5 relative hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(249,115,22,0.3)] group">
      <img src={imageUrl} alt={product.name} className="w-full h-[240px] object-cover transition-transform duration-500 ease group-hover:scale-105" />
      <div className="p-5 text-left grow flex flex-col justify-between bg-[linear-gradient(to_top,#18181b_80%,transparent)] relative z-10">
        <h3 className="text-[1.1rem] mb-2.5 text-white whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</h3>
        <p className="text-[22px] font-bold text-orange-500 mb-[15px]">₹{price.toFixed(2)}</p>
        <Link to={`/product/${product._id}`} className="text-orange-500 hover:text-orange-400 underline">
          view details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
