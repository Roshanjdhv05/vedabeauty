import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'vedabeauty' && password === '1234567') {
      localStorage.setItem('admin_token', 'veda_admin_session_active');
      navigate('/admin/overview');
    } else {
      setError('Invalid admin credentials. Access Denied.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
              <ShieldCheck size={40} className="text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Admin Gateway</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-2">Veda Beauty Professional</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-4">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-accent/50 transition-all"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-accent/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full bg-accent text-black py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-accent/20"
            >
              Authorize Access
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-white/20 text-[9px] font-bold uppercase tracking-widest">
          Secure Encrypted Management Terminal
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
