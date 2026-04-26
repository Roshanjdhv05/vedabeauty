import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileBar from './StickyMobileBar';
import PWAInstallBanner from '../ui/PWAInstallBanner';

const MainLayout = ({ children, showMobileBar = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PWAInstallBanner />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <StickyMobileBar visible={showMobileBar} />
    </div>
  );
};

export default MainLayout;
