import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

const IOSInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const isStandalone = () => {
      // Check if it's already installed as a PWA on iOS
      return ('standalone' in window.navigator) && window.navigator.standalone;
    };

    // Very basic check if we're mostly likely in Safari (and not inside some WebViews)
    const isSafari = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('fxios');
    };

    // If not iOS or already installed, don't show
    if (!isIos() || isStandalone()) {
      return;
    }

    // Check if dismissed recently (7 days)
    const dismissedAt = localStorage.getItem('veda_ios_install_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // DEBUG: Force show banner if URL has ?test-ios=true
    if (window.location.search.includes('test-ios=true')) {
      setShowPrompt(true);
      return;
    }

    // Show the floating button if we passed all checks
    setShowPrompt(true);

  }, []);

  const handleDismissPrompt = (e) => {
    e.stopPropagation();
    localStorage.setItem('veda_ios_install_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  const handleDismissModal = () => {
    localStorage.setItem('veda_ios_install_dismissed', Date.now().toString());
    setShowModal(false);
    setShowPrompt(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {showPrompt && !showModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] md:hidden"
          >
            <div className="relative group">
              {/* Dismiss X button attached to the pill */}
              <button 
                onClick={handleDismissPrompt}
                className="absolute -top-2 -right-2 bg-white text-gray-500 rounded-full p-1 shadow-md border border-gray-100 z-10"
              >
                <X size={12} />
              </button>
              
              <button
                onClick={() => setShowModal(true)}
                className="bg-white/90 backdrop-blur-xl border border-[#F8C8DC]/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
                           px-6 py-3 rounded-full flex items-center gap-3 active:scale-95 transition-all
                           text-black font-semibold text-sm"
              >
                <div className="w-6 h-6 rounded bg-[#111111] text-[#D4AF37] flex items-center justify-center">
                  <Smartphone size={14} />
                </div>
                <span>Install App</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismissModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Top accent line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#F8C8DC] via-[#D4AF37] to-[#111111]"></div>
              
              <div className="p-6">
                <button 
                  onClick={handleDismissModal}
                  className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mt-2 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg border border-gray-100 mb-4">
                    <img src="/icons/icon-192.png" alt="Veda Beauty Logo" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#111111]">Install Veda Beauty App ✨</h3>
                  <p className="text-gray-500 text-sm mt-2">Get the ultimate premium shopping experience right on your home screen.</p>
                </div>

                <div className="space-y-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#007AFF] font-bold">1</div>
                    <div className="flex-1 text-sm text-gray-700 font-medium flex items-center gap-2">
                      Tap the Safari Share button 
                      <span className="text-[#007AFF] inline-flex items-center justify-center w-6 h-6 rounded bg-white shadow-sm"><Share size={14} /></span>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gray-200" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#007AFF] font-bold">2</div>
                    <div className="flex-1 text-sm text-gray-700 font-medium flex items-center gap-2">
                      Scroll and tap "Add to Home Screen"
                      <span className="text-gray-600 inline-flex items-center justify-center w-6 h-6 rounded bg-white shadow-sm"><PlusSquare size={14} /></span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gray-200" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#007AFF] font-bold">3</div>
                    <div className="flex-1 text-sm text-gray-700 font-medium">
                      Tap <span className="font-bold text-[#007AFF]">"Add"</span> to install
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                    For best experience, use Safari browser.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IOSInstallPrompt;
