import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const LimitedOfferPopUp = () => {
  const [offer, setOffer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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
        // Check session storage to see if user dismissed it recently
        const dismissedAt = sessionStorage.getItem(`dismissed_offer_${data.id}`);
        // Only show if not dismissed in this session
        if (!dismissedAt) {
          setOffer(data);
          setIsVisible(true);
        }
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
        // Calculate time until start if you wanted to, but we'll just show the date
      } else if (now >= startTime && now <= endTime) {
        setStatus('active');
        const difference = endTime - now;
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days > 0 ? `${days}d ` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setStatus('expired');
        setIsVisible(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [offer]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    if (offer) {
      sessionStorage.setItem(`dismissed_offer_${offer.id}`, new Date().toISOString());
    }
  };

  const handleBannerClick = () => {
    if (offer) {
      navigate(`/limited-offers/${offer.id}`);
      setIsVisible(false); // Optionally hide after clicking
    }
  };

  if (!isVisible || !offer || status === 'expired') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full cursor-pointer flex flex-col"
            onClick={handleBannerClick}
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
            >
              <X size={16} />
            </button>

            {/* Banner Image - Vertical orientation preferred */}
            <div className="w-full aspect-[3/4] bg-gray-100 relative">
              <img 
                src={offer.banner_url} 
                alt="Limited Offer" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Gradient for Text Readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 pb-8">
                
                {status === 'upcoming' ? (
                  <div className="text-center">
                    <p className="text-accent font-bold uppercase tracking-widest text-xs mb-1">Upcoming Offer</p>
                    <h3 className="text-white font-serif text-xl font-bold">
                      Starts {new Date(offer.start_time).toLocaleDateString()}
                    </h3>
                    <p className="text-white/80 text-sm mt-2">
                      at {new Date(offer.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                      <Clock size={12} className="animate-pulse" /> Limited Time
                    </div>
                    <h3 className="text-white font-serif text-2xl font-bold mb-2">
                      {offer.discount_percentage}% OFF
                    </h3>
                    <div className="text-3xl font-mono font-bold text-accent tracking-wider drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                      {timeLeft}
                    </div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">
                      Click to view offer products
                    </p>
                  </div>
                )}
                
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LimitedOfferPopUp;
