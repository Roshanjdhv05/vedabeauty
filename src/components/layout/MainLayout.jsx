import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileBar from './StickyMobileBar';
import BottomNavigation from './BottomNavigation';

const MainLayout = ({ children, showMobileBar = false }) => {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <StickyMobileBar visible={showMobileBar} />
      {!showMobileBar && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
