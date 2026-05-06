import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter mb-3 text-black">Reset Password</h1>
          <p className="text-black/40 text-sm font-medium uppercase tracking-widest">We'll send you a recovery link</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-black/60 text-sm font-medium leading-relaxed">
              A password reset link has been sent to <span className="font-bold text-black">{email}</span>. 
              Please check your inbox.
            </p>
            <Link 
              to="/login" 
              className="inline-block w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent transition-all active:scale-95 shadow-xl"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-xl"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-black/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-8">
              Remember your password?{' '}
              <Link to="/login" className="text-accent hover:underline"> Sign In</Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
