import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      console.log('appinstalled fired');
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Force show banner after a delay for testing, regardless of dismissal
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS/Non-supported browsers
      alert("To install Veda Beauty: \n1. Tap the Share button\n2. Select 'Add to Home Screen'");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Removed sessionStorage restriction so user can keep seeing it until fixed
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 inset-x-0 z-[10000] p-4 pointer-events-none"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 p-5 overflow-hidden relative group">
              {/* Animated Accent Gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F8C8DC] via-[#D4AF37] to-[#F8C8DC] animate-shimmer" />
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-black/5 shadow-inner">
                      <img src="/logo.jpeg" alt="Veda Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-[#D4AF37] text-white p-1 rounded-lg shadow-lg">
                      <Sparkles size={10} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Veda Beauty App</h3>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Fast • Secure • Offline</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="bg-black text-white px-5 py-2.5 rounded-2xl text-[13px] font-black hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                  >
                    Install
                  </button>
                  <button 
                    onClick={handleDismiss}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
