import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log('PWA: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the native install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response to the install prompt: ${outcome}`);

    // Clear the prompt so it can only be used once
    setDeferredPrompt(null);
  };

  // Only show the button if the install prompt is available
  if (!deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-6 py-2 bg-accent text-black text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] group active:scale-95"
    >
      <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
      <span>Install App</span>
    </button>
  );
};

export default PWAInstallButton;
