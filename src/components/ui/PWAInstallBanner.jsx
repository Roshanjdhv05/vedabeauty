import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const isDismissed = sessionStorage.getItem('pwa-banner-dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show banner after a short delay on visit
    const timer = setTimeout(() => {
      const isDismissed = sessionStorage.getItem('pwa-banner-dismissed');
      if (!isDismissed && !isInstalled) {
        setIsVisible(true);
      }
    }, 1000);

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
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS/Non-supported browsers
      alert("To install Veda Beauty: \n1. Tap the Share/Menu icon\n2. Select 'Add to Home Screen'");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 inset-x-4 mx-auto max-w-md z-[9999]"
        >
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-black/5 flex-shrink-0">
                <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 leading-tight">Install Veda Beauty</h3>
                <p className="text-[11px] text-gray-500 font-medium">www.vedabeauty.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleInstallClick}
                className="text-sm font-bold text-[#0066cc] hover:text-[#004499] transition-colors px-2 py-1"
              >
                Install
              </button>
              <button 
                onClick={handleDismiss}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
