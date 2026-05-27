
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  Store,
  LogOut,
  Search,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { useSearch } from "../context/SearchContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toLowerCase() || "nc"
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToShop = () => {
    navigate("/shop");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      goToShop();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0f1e]">
      <div className="mx-auto flex h-[70px] w-full max-w-6xl items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-blue-600 text-[30px] font-medium text-white">
            nc
          </span>
          <span className="text-[30px] font-medium tracking-tight text-white">
            NexCart
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search pill */}
        <button
          type="button"
          onClick={goToShop}
          className="flex h-[40px] min-w-[300px] items-center gap-2 rounded-[7px] border border-white/[0.09] bg-white/[0.04] px-3 text-[13px] text-white/35 hover:bg-white/[0.07] hover:text-white/60"
        >
          <Search className="h-[14px] w-[14px]" />
          <input
            type="text"
            value={searchQuery}
            placeholder="search products, brands…"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent text-white/70 outline-none placeholder:text-white/45"
          />
        </button>

        {/* Separator */}
        <div className="h-[18px] w-px bg-white/10" />

        {/* Actions */}
        <nav className="flex items-center gap-5">

          {/* Wishlist */}
          <Link
            to="/shop"
            className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border border-white/[0.09] bg-white/[0.04] text-white/50 hover:border-blue-600/30 hover:bg-blue-600/15 hover:text-blue-300"
            aria-label="Wishlist"
          >
            <Store className="h-[30px] w-[30px]" />
            <span className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-medium text-white">
              5
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border border-white/[0.09] bg-white/[0.04] text-white/50 hover:border-blue-600/30 hover:bg-blue-600/15 hover:text-blue-300"
            aria-label="Cart"
          >
            <ShoppingCart className="h-[30px] w-[30px]" />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-medium text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border border-white/[0.09] bg-white/[0.04] text-white/50 hover:border-blue-600/30 hover:bg-blue-600/15 hover:text-blue-300"
              aria-label="Admin"
            >
              <ShieldCheck className="h-[30px] w-[30px]" />
            </Link>
          )}

          {/* Separator */}
          <div className="h-[18px] w-px bg-white/10" />

          {/* User or Login */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/profile"
                className="flex h-[40px] items-center gap-1.5 rounded-[7px] border border-white/[0.09] bg-white/[0.04] px-2 text-white hover:border-blue-600/30 hover:bg-blue-600/15"
              >
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-blue-700 text-[20px] font-medium text-white">
                  {getInitials(user.name)}
                </span>
                <span className="max-w-[200px] truncate text-[18px] font-medium text-white/80">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-white/30" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border border-white/[0.09] bg-white/[0.04] text-white/50 hover:border-blue-600/30 hover:bg-blue-600/15 hover:text-blue-300"
                aria-label="Logout"
              >
                <LogOut className="h-[20px] w-[20px]" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-[30px] items-center rounded-[7px] border border-white/[0.09] bg-white/[0.04] px-4 text-[13px] font-medium text-white/70 hover:bg-white/[0.07] hover:text-white"
            >
              login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;