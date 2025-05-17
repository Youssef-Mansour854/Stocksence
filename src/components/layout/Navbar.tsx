import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, ClipboardList, Home, LogOut, Menu, Package, ShoppingCart, User, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Products', path: '/products', icon: <Package className="h-5 w-5" /> },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Inventory', path: '/inventory', icon: <ClipboardList className="h-5 w-5" /> },
  ];
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">StockSence</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'bg-teal-800 text-white'
                        : 'text-teal-100 hover:bg-teal-600'
                    }`}
                  >
                    <span className="mr-1.5">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <button
                      onClick={handleSignOut}
                      className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:bg-teal-600 flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-100 hover:bg-teal-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-teal-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      location.pathname === link.path
                        ? 'bg-teal-700 text-white'
                        : 'text-teal-100 hover:bg-teal-600'
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:bg-teal-600 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;