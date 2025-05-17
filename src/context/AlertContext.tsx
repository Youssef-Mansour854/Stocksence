import React, { createContext, useContext, useState } from 'react';
import { AlertMessage } from '../types';

interface AlertContextType {
  alert: AlertMessage | null;
  showAlert: (type: AlertMessage['type'], message: string, duration?: number) => void;
  clearAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  const showAlert = (type: AlertMessage['type'], message: string, duration = 3000) => {
    setAlert({ type, message });
    
    // Auto clear after duration
    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  const clearAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};