import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/50"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter mb-3 text-black">Welcome Back</h1>
          <p className="text-black/40 text-sm font-medium uppercase tracking-widest">Access your professional account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-accent transition-colors w-5 h-5" />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-accent/30 transition-all placeholder:text-black/20 text-sm font-bold tracking-widest"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-accent transition-colors w-5 h-5" />
            <input
              type="password"
              placeholder="PASSWORD"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-accent/30 transition-all placeholder:text-black/20 text-sm font-bold tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-1">
            <label className="flex items-center gap-2 cursor-pointer text-black/40">
              <input type="checkbox" className="rounded-md border-gray-300 text-accent focus:ring-accent" />
              Remember me
            </label>
            <Link to="#" className="text-accent hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-8 shadow-xl"
          >
            {loading ? 'Verifying...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em] text-black/20 font-bold bg-white px-4">
            New to Veda Beauty?
          </div>
        </div>

        <p className="text-center text-black/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline"> Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
