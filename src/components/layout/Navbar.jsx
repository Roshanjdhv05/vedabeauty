import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, LogOut, ChevronRight, LayoutGrid, Package, Info, PhoneCall } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Shop All', path: '/', icon: <LayoutGrid size={18} /> },
    { name: 'Wholesale Deals', path: '/', icon: <Package size={18} /> },
    { name: 'About Veda', path: '/', icon: <Info size={18} /> },
    { name: 'Contact Us', path: '/', icon: <PhoneCall size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-black text-white py-1 md:py-2 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-1 md:gap-6">
        
        {/* Mobile Menu Icon */}
        <button 
          className="md:hidden p-1 text-white/80"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex-shrink-0 flex flex-col items-start text-left">
          <Link to="/" className="text-lg md:text-2xl font-serif font-bold tracking-tighter leading-none text-white">
            VEDA BEAUTY
          </Link>
          <span className="text-[7px] md:text-[10px] font-sans font-bold text-accent tracking-[0.1em] leading-none mt-0.5 uppercase">
            Professional Wholesale
          </span>
        </div>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 max-w-xl relative group">
          <input
            type="text"
            placeholder="Search professional products..."
            className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:bg-white/20 focus:border-accent/50 transition-all placeholder:text-white/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={18} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 md:gap-6">
          <button 
            className="md:hidden p-1.5 text-white/80"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={18} />
          </button>

          {/* User Account */}
          <div className="relative group">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 transition-all"
                >
                  <User size={16} className="text-accent" />
                </button>
                
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-2xl shadow-2xl border border-black/5 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 py-3 bg-gray-50 border-b border-black/5">
                    <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Signed in as</p>
                    <p className="text-xs font-bold truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors">
                    <User size={14} /> Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors border-t border-black/5"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all">
                Login
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-1 md:gap-4">
            <Link to="/wishlist" className="relative p-1.5 text-white/80">
              <Heart size={18} />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent text-black text-[8px] font-bold rounded-full flex items-center justify-center border border-black">
                {wishlist?.length || 0}
              </span>
            </Link>
            <Link to="/cart" className="relative p-1.5 text-white/80">
              <ShoppingCart size={18} />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent text-black text-[8px] font-bold rounded-full flex items-center justify-center border border-black">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-black flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-serif font-bold text-white tracking-tighter">VEDA BEAUTY</span>
                  <span className="text-[8px] font-sans font-bold text-accent tracking-[0.2em] uppercase">Professional</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/5 active:bg-accent/10 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-accent group-hover:text-white transition-colors">
                          {link.icon}
                        </div>
                        <span className="text-sm font-bold text-black uppercase tracking-widest">{link.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-black/20" />
                    </Link>
                  ))}

                  <div className="my-4 border-t border-black/5 pt-4">
                    <Link
                      to="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-pink-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                          <Heart size={18} fill={wishlist?.length > 0 ? "currentColor" : "none"} />
                          {wishlist?.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                              {wishlist.length}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-black uppercase tracking-widest">My Wishlist</span>
                      </div>
                      <ChevronRight size={16} className="text-black/20" />
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/10 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-black">
                          <ShoppingCart size={18} />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                              {cartCount}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-black uppercase tracking-widest">My Cart</span>
                      </div>
                      <ChevronRight size={16} className="text-black/20" />
                    </Link>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-black/5">
                  <p className="px-4 text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-4">Account</p>
                  {user ? (
                    <div className="px-4">
                      <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                        <p className="text-[10px] font-bold text-black/40 uppercase">Signed in as</p>
                        <p className="text-sm font-bold truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 p-4 text-sm font-bold uppercase tracking-widest text-black"
                      >
                        <User size={18} /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 text-sm font-bold uppercase tracking-widest text-red-600"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="mx-4 flex items-center justify-center p-4 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em]"
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 text-center">
                <p className="text-[9px] text-black/30 font-bold uppercase tracking-widest">
                  Bulk order support: 24/7
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden px-4 pb-4 pt-2 bg-black border-t border-white/10"
          >
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-12 text-sm focus:outline-none text-white placeholder:text-white/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="w-4 h-4 text-white/40 hover:text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
