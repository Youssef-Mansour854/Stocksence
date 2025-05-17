import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import Alert from '../ui/Alert';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { alert, clearAlert } = useAlert();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      {alert && <Alert alert={alert} onClose={clearAlert} />}
    </div>
  );
};

export default Layout;