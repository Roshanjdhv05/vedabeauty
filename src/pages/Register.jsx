import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Pass name in data object for profile creation
    const { error } = await signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Sucessful signup (might need email verification depending on Supabase settings)
      alert("Registration successful! Please check your email for verification.");
      navigate('/login');
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter mb-3 text-black">Create Account</h1>
          <p className="text-black/40 text-sm font-medium uppercase tracking-widest text-center">Join the professional community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-accent transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="FULL NAME"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-accent/30 transition-all placeholder:text-black/20 text-sm font-bold tracking-widest"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="PASSWORD (MIN 6)"
              required
              minLength={6}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-accent/30 transition-all placeholder:text-black/20 text-sm font-bold tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 px-1 text-[9px] font-bold uppercase tracking-widest text-black/30">
            <Shield className="w-4 h-4 text-green-500" />
            End-to-end encrypted registration
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-8 shadow-xl"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-10 text-center text-black/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline"> Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
