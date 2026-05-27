import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#172337] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">About</h3>
          <div className="grid gap-2 text-sm">
            <Link to="/about" className="hover:underline">About NexCart</Link>
            <Link to="/shop" className="hover:underline">Shop Products</Link>
            <Link to="/disclaimer" className="hover:underline">Disclaimer</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">Help</h3>
          <div className="grid gap-2 text-sm">
            <Link to="/return" className="hover:underline">Return Policy</Link>
            <Link to="/cart" className="hover:underline">Cart</Link>
            <Link to="/profile" className="hover:underline">My Account</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">Policy</h3>
          <div className="grid gap-2 text-sm">
            <Link to="/return" className="hover:underline">Returns</Link>
            <Link to="/disclaimer" className="hover:underline">Terms</Link>
            <a href="mailto:support@nexcart.com" className="hover:underline">Support</a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">NexCart</h3>
          <p className="text-sm leading-6 text-gray-200">
            Simple online shopping for electronics, fashion, home, beauty and more.
          </p>
          <p className="mt-4 text-sm text-gray-300">
            Copyright {new Date().getFullYear()} NexCart
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
