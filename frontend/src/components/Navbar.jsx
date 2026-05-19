import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import {AuthContext} from '../context/AuthContext';
import {useSelector} from 'react-redux';

const Navbar = () => {
   const {user, logout} = useContext(AuthContext);
   const cartItems = useSelector((state)=>state.cart.cartItems);
   const navigate = useNavigate();
   
   const handleLogout = ()=>{
      logout();
      navigate('/login');
   }

  return (
     <nav className='flex flex-col md:flex-row justify-between items-center p-[15px_20px] md:p-[18px_50px] gap-[15px] md:gap-0 bg-zinc-950/80 backdrop-blur-[12px] border-b border-white/5 sticky top-0 z-[1000] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'>
        <div>
            <Link to="/" className="text-[35px] font-bold text-white tracking-[-1px] flex items-center gap-[10px] [text-shadow:0_2px_10px_rgba(249,115,22,0.3)] after:content-['.'] after:text-orange-500 after:text-[36px]">
          <img src="/img/NextCartpng.png" alt="NexCart" style={{ height: '50px', width: '50px', borderRadius: '8px', objectFit: 'cover' }} />
          NexCart
        </Link>
        </div>
        <ul className='flex items-center gap-[100px]'>
            <li><Link to="/shop" className="text-[20px] font-medium text-zinc-400 relative hover:text-white after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-orange-500 after:transition-all after:duration-300 after:rounded-sm">Shop</Link></li>
            <li><Link to='/cart' className="text-[20px] font-medium text-zinc-400 relative hover:text-white after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-orange-500 after:transition-all after:duration-300 after:rounded-sm">Cart ({cartItems.length})</Link></li>
            {user?(
               <>
                  <li><Link to='/profile' className="text-[20px] font-medium text-zinc-400 relative hover:text-white after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-orange-500 after:transition-all after:duration-300 after:rounded-sm">Hi, {user.name}</Link></li>
                  {user.role === 'admin'&&<li><Link to="/admin" className="text-[20px] font-medium text-zinc-400 relative hover:text-white after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-orange-500 after:transition-all after:duration-300 after:rounded-sm">Admin</Link></li>}
                  <li><button onClick={handleLogout} className="bg-transparent text-red-500 border border-red-500/30 py-2 px-4 rounded-md cursor-pointer font-semibold transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:-translate-y-[1px]">Logout</button></li>
               </>
               ) : (
               <li><Link to="/login" className="text-[20px] font-medium text-zinc-400 relative hover:text-white after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-orange-500 after:transition-all after:duration-300 after:rounded-sm">Login</Link></li>
            )}
        </ul>     
    </nav>
  )
}

export default Navbar;
