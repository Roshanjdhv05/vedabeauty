import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Tag } from 'lucide-react';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isInstalled = localStorage.getItem('veda_app_installed');
    
    if (isStandalone || isInstalled) {
      return;
    }

    // Check if dismissed recently (7 days)
    const dismissedAt = localStorage.getItem('veda_install_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // DEBUG: Force show banner if URL has ?test-install=true
    if (window.location.search.includes('test-install=true')) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the banner if not already visible
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback: If we don't get beforeinstallprompt right away (e.g., iOS Safari where it's not supported, 
    // or if the browser has its own logic), we might still want to show a guide or banner, 
    // but the prompt explicitly asked to trigger deferredPrompt.prompt() on install.
    // We will only show if deferredPrompt is caught, which guarantees installability on Chrome/Android.

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      localStorage.setItem('veda_app_installed', 'true');
      setShowBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('veda_install_dismissed', Date.now().toString());
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed z-50 bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-96 
                     bg-white/80 backdrop-blur-xl md:rounded-2xl rounded-t-3xl 
                     shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
                     border border-[#F8C8DC]/30 overflow-hidden"
        >
          {/* Top accent line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#F8C8DC] via-[#D4AF37] to-[#111111]"></div>
          
          <div className="p-4 sm:p-5 relative">
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              aria-label="Close install prompt"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-start pr-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-md">
                <img src="/icons/icon-192.png" alt="Veda Beauty Logo" className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-[#111111] font-bold font-serif text-lg leading-tight">Veda Beauty</h3>
                <p className="text-gray-600 text-xs mt-1 leading-snug">
                  Install Veda Beauty App for a faster shopping experience
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-[10px] font-medium text-gray-500">
                  <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-[#D4AF37]" /> Fast access</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Tag className="w-3 h-3 text-[#D4AF37]" /> Exclusive offers</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleInstall}
              className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-white text-sm tracking-wide
                         bg-gradient-to-r from-[#D4AF37] to-[#c49b2e] hover:shadow-[0_4px_15px_rgba(212,175,55,0.4)]
                         transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Install App
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
