import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Download } from 'lucide-react';
import { Sale } from '../../types';

interface SalesListProps {
  sales: Sale[];
  onAddNew: () => void;
}

const SalesList: React.FC<SalesListProps> = ({ sales, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.date.includes(dateFilter);
    return matchesSearch && matchesDate;
  });
  
  // Get unique dates for filtering
  const uniqueDates = Array.from(
    new Set(sales.map((sale) => sale.date.split('T')[0]))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const exportToCsv = () => {
    if (filteredSales.length === 0) return;
    
    const headers = ['Product', 'Quantity', 'Total Price', 'Date'];
    const csvRows = [
      headers.join(','),
      ...filteredSales.map(
        (sale) =>
          `"${sale.productName}",${sale.quantity},${sale.totalPrice.toFixed(2)},"${new Date(
            sale.date
          ).toLocaleString()}"`
      ),
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate totals
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-teal-50 border-b border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-teal-800 flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5 text-teal-600" />
          Sales Records
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
          
          <button
            onClick={exportToCsv}
            disabled={filteredSales.length === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          
          <button
            onClick={onAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </button>
        </div>
      </div>
      
      {filteredSales.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {sales.length === 0 ? (
            <p>No sales recorded yet. Add your first sale to get started.</p>
          ) : (
            <p>No sales match your search criteria.</p>
          )}
        </div>
      ) : (
        <>
          <div className="p-4 bg-blue-50 border-b border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Total Items Sold</p>
              <p className="text-xl font-bold text-blue-600">{totalItems}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${sale.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(sale.date).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesList;