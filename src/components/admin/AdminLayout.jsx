import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/admin/overview' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Categories Banner', icon: <ImageIcon size={20} />, path: '/admin/category-images' },
    { name: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/admin/messages' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#0a0a0a] text-white z-50">
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-8 border-b border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-black shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold tracking-tighter">VEDA ADMIN</span>
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Master Terminal</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
            <p className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Core Management</p>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  location.pathname === item.path 
                  ? 'bg-accent text-black shadow-lg shadow-accent/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </div>
                {location.pathname === item.path && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">System Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 py-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-serif font-bold text-gray-900">
              {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Welcome back, Administrator</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Server Status: Online</span>
             </div>
             <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Veda+Beauty&background=FFD700&color=000" alt="Admin" />
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
