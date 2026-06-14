import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Tag, Award, User } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Category', path: '/categories', icon: <LayoutGrid className="w-5 h-5" /> },
    { name: 'Offers', path: '/offers', icon: <Tag className="w-5 h-5" /> },
    { name: 'Brands', path: '/brands', icon: <Award className="w-5 h-5" /> },
    { name: 'Account', path: '/profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium leading-none">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
