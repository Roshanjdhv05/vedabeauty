import React from 'react';
import { Camera, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter">
              VEDA <span className="text-[var(--primary)]">BEAUTY</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for premium, multi-brand organic and luxury cosmetics. Natural beauty, redefined.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <a 
                href="https://www.instagram.com/vedabeauty.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[var(--primary)] transition-all transform hover:scale-110"
                title="Follow us on Instagram"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/918169292310" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[var(--primary)] transition-all transform hover:scale-110"
                title="Chat with us on WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[var(--primary)]">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Trending Products</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shop by Category</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Offers & Deals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[var(--primary)]">Customer Care</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/profile" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="/profile" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li className="pt-4 border-t border-gray-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest">Return Exceptions</p>
                  <p className="text-[10px] leading-relaxed text-gray-500 italic">
                    Products with damage, products with expiry, or products different from the order are accepted, else not.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 text-[var(--primary)]">Get In Touch</h3>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin className="w-5 h-5 flex-shrink-0 text-gray-500" />
              <span className="leading-relaxed">
                Jasmine Plaza, Opp Radha Krishna,<br />
                Jambhali Naka Station Road,<br />
                Thane West - 400601
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Phone className="w-5 h-5 flex-shrink-0 text-gray-500" />
              <span>+91 81692 92310</span>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>© 2026 Veda Beauty. All rights reserved. Designed for excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
