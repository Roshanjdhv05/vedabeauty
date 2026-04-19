import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  User,
  Settings,
  ShieldCheck,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: Package, path: '/orders' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '#' },
    { id: 'settings', label: 'Account Settings', icon: Settings, path: '#' },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck, path: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Header */}
      <div className="bg-white px-4 py-8 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Account</h1>
        <div className="w-8 h-8 rounded-full bg-[#F8C8DC]/20 flex items-center justify-center">
           <User size={18} className="text-[#F8C8DC]" />
        </div>
      </div>


      <div className="px-4 mt-6 max-w-xl mx-auto space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#F8C8DC] flex items-center justify-center text-white font-serif text-2xl font-bold shadow-inner border-2 border-white">
            {user?.email?.charAt(0).toUpperCase() || 'V'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {user?.email?.split('@')[0] || 'Veda Beauty Member'}
            </h2>
            <p className="text-gray-400 text-xs font-medium">{user?.email}</p>
            <button className="mt-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:underline">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-50 hover:bg-gray-50 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F8C8DC]/10 text-[#F8C8DC] rounded-xl flex items-center justify-center group-hover:bg-[#F8C8DC] group-hover:text-white transition-all">
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-bold text-gray-800 tracking-tight">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
            </button>
          ))}
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={handleLogout}
          className="w-full mt-8 p-5 bg-white text-red-400 rounded-2xl shadow-sm border border-red-50 flex items-center justify-center gap-3 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-[0.2em] active:scale-95"
        >
          <LogOut size={18} />
          Sign Out
        </button>

        {/* Footer Info */}
        <div className="text-center pt-8">
           <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Veda Beauty v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;


