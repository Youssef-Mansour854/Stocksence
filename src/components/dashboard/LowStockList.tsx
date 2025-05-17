import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Product } from '../../types';

interface LowStockListProps {
  products: Product[];
}

const LowStockList: React.FC<LowStockListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <p className="text-gray-500">No low stock products</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-amber-50 border-b border-amber-100">
        <h3 className="font-medium flex items-center text-amber-800">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
          Low Stock Products
        </h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${product.quantity <= 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {product.quantity} in stock
                </p>
                <p className="text-sm text-gray-500">Min: {product.minQuantity}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockList;