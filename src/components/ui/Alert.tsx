import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { AlertMessage } from '../../types';

interface AlertProps {
  alert: AlertMessage;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onClose }) => {
  const { type, message } = alert;
  
  const alertClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };
  
  const IconComponent = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 rounded-lg shadow-md border ${alertClasses[type]} flex items-center justify-between transition-all duration-300 ease-in-out`}>
      <div className="flex items-center">
        <IconComponent className="w-5 h-5 mr-2" />
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;