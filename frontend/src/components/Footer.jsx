import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-white/5 px-5 py-10 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-5">
        
        {/* Brand */}
        <div>
          <h3 className="text-orange-500 mb-2.5">NexCart</h3>
          <p className="text-zinc-400 text-sm">Premium E-Commerce Platform.</p>
        </div>

        {/* Links */}
        <div className="flex gap-5">
          <Link to="/about" className="text-zinc-400 text-sm hover:text-white transition-colors">About Us</Link>
          <Link to="/return" className="text-zinc-400 text-sm hover:text-white transition-colors">Return Policy</Link>
          <Link to="/disclaimer" className="text-zinc-400 text-sm hover:text-white transition-colors">Disclaimer</Link>
        </div>

        {/* Copyright */}
        <div className="text-zinc-400 text-sm">
          &copy; {new Date().getFullYear()} NexCart. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;