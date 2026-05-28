import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const LimitedOfferSection = () => {
  const [offer, setOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('upcoming'); // upcoming, active, expired
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveOffer = async () => {
      // Fetch the most recently created active offer that hasn't expired yet
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('limited_offers')
        .select('*')
        .eq('is_active', true)
        .gte('end_time', now)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setOffer(data);
      }
    };

    fetchActiveOffer();
  }, []);

  useEffect(() => {
    if (!offer) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const startTime = new Date(offer.start_time).getTime();
      const endTime = new Date(offer.end_time).getTime();

      if (now < startTime) {
        setStatus('upcoming');
        const difference = startTime - now;
        formatTime(difference);
      } else if (now >= startTime && now <= endTime) {
        setStatus('active');
        const difference = endTime - now;
        formatTime(difference);
      } else {
        setStatus('expired');
      }
    };

    const formatTime = (difference) => {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days > 0 ? `${days}d ` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [offer]);

  if (!offer || status === 'expired') return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        onClick={() => navigate(`/limited-offers/${offer.id}`)}
        className="relative overflow-hidden rounded-3xl cursor-pointer group shadow-[0_0_30px_rgba(225,29,72,0.3)] border border-rose-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] bg-gradient-to-br from-rose-950 via-red-900 to-black"
      >
        {/* Glow Effects */}
        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-rose-500/10 to-transparent rotate-45 blur-2xl group-hover:animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 rounded-full blur-[80px]" />

        <div className="relative flex flex-row items-center min-h-[120px] md:min-h-[180px]">
          
          {/* Banner Image Side - Hidden on Mobile, Smaller on Desktop */}
          <div className="hidden md:block w-1/3 relative h-full min-h-[180px] overflow-hidden">
            <img 
              src={offer.banner_url} 
              alt="Limited Offer" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            {/* Gradient Overlay for blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-red-900/90" />
          </div>

          {/* Content Side - Horizontal layout */}
          <div className="w-full md:w-2/3 flex flex-row items-center justify-between p-5 md:p-8 relative z-10 gap-4">
            
            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-500/20 to-accent/20 border border-accent/30 text-accent rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-3 backdrop-blur-md w-fit shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                <Clock size={12} className="animate-pulse text-accent" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-accent">
                  {status === 'upcoming' ? 'Coming Soon' : 'Limited Offer'}
                </span>
              </div>
              
              <h2 className="text-xl md:text-4xl font-serif font-bold text-white mb-1 md:mb-2 tracking-tight leading-tight">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">{offer.discount_percentage}% OFF</span>
              </h2>
              <p className="text-rose-100/70 text-[10px] md:text-sm max-w-xs md:max-w-sm line-clamp-2">
                Exclusive premium collection. Grab it before time runs out!
              </p>
              
              <div className="hidden md:flex mt-4 items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Explore collection &rarr;
              </div>
            </div>

            {/* Timer Box */}
            <div className="shrink-0 bg-black/40 border border-rose-500/30 rounded-xl md:rounded-2xl p-3 md:p-5 backdrop-blur-md shadow-2xl min-w-[100px] md:min-w-[140px] flex flex-col items-center justify-center group-hover:bg-black/60 transition-colors">
              <p className="text-[8px] md:text-[10px] text-rose-200/80 font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-center">
                {status === 'upcoming' ? 'Starts In' : 'Ends In'}
              </p>
              <div className="text-lg md:text-3xl font-mono font-bold text-accent tracking-wider text-center drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
                {timeLeft}
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default LimitedOfferSection;
