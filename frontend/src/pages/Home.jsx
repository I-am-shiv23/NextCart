import React, { useContext, useEffect } from "react";
import heroBg from "../assets/hero_bg.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/shop");
    }
  }, [user]);

  return (
    <div className="home-container">
      <div className="relative w-full h-[550px] md:h-[720px] rounded-[2rem]  overflow-hidden flex items-center shadow-lg">
        <img src={heroBg} alt="Hero Background" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/70" />

        <div className="relative z-10 w-full flex justify-end px-8 md:px-16">
          <div className="max-w-[550px] flex flex-col items-start text-white text-left">
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4 text-zinc-200">
              Artisan Goods
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif mb-5 leading-[1.1] text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.3)]">
              Uncover brands for artisan living home.
            </h1>
            <p className="text-sm md:text-base text-zinc-200 mb-8 leading-relaxed max-w-[450px]">
              Shop wide range of curated artisan goods, decor, and stylish home products.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {user ? (
                // Agar logged in hai to sirf Shop Now dikhao
                <Link to="/shop" className="bg-[#7a8b7a] hover:bg-[#687a68] text-white px-8 py-3 rounded-[4px] text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300">
                  Shop Now
                </Link>
              ) : (
                // Agar logged out hai to dono buttons dikhao
                <>
                  <Link to="/shop" className="bg-[#7a8b7a] hover:bg-[#687a68] text-white px-8 py-3 rounded-[4px] text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300">
                    Shop Now
                  </Link>
                  <Link to="/register" className="border border-white/80 hover:bg-white/10 text-white px-8 py-3 rounded-[4px] text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300">
                    Sign In Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Star */}
        <div className="absolute bottom-8 right-12 text-[#d1c4b4] opacity-80">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;