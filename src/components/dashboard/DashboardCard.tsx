import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
}) => {
  const bgColorClass = `bg-${color}-50`;
  const iconColorClass = `text-${color}-600`;
  const borderColorClass = `border-${color}-100`;
  
  return (
    <div className={`p-6 rounded-lg shadow-sm ${bgColorClass} border ${borderColorClass} transition-transform duration-200 hover:transform hover:translate-y-[-5px]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${bgColorClass} ${iconColorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;