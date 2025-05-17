import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Sale } from '../../types';

interface RecentSalesProps {
  sales: Sale[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <p className="text-gray-500">No recent sales</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h3 className="font-medium flex items-center text-blue-800">
          <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
          Recent Sales
        </h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {sales.map((sale) => (
          <li key={sale.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{sale.productName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(sale.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">
                  ${sale.totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {sale.quantity}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSales;