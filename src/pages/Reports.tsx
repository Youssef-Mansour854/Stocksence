import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, ArrowUp, ArrowDown, Package, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sale, Product } from '../types';
import { useAlert } from '../context/AlertContext';

const Reports: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('thisMonth');
  
  const { showAlert } = useAlert();
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      // Fetch all sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false });
        
      if (salesError) throw salesError;
      
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
        
      if (productsError) throw productsError;
      
      setSales(salesData as Sale[]);
      setProducts(productsData as Product[]);
    } catch (error: any) {
      showAlert('error', error.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter sales based on time frame
  const filterSalesByTimeFrame = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeFrame) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'thisWeek':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'thisMonth':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'thisYear':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'allTime':
        return sales;
      default:
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
    }
    
    return sales.filter((sale) => new Date(sale.date) >= startDate);
  };
  
  const filteredSales = filterSalesByTimeFrame();
  
  // Calculate metrics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  
  // Sales by product
  const salesByProduct = filteredSales.reduce((acc, sale) => {
    acc[sale.productId] = (acc[sale.productId] || 0) + sale.totalPrice;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array and sort by revenue
  const topProducts = Object.entries(salesByProduct)
    .map(([productId, revenue]) => {
      const product = products.find((p) => p.id === productId);
      return {
        id: productId,
        name: product?.name || 'Unknown Product',
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
    
  // Calculate profit
  const calculateProfit = () => {
    let totalCost = 0;
    
    filteredSales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (product) {
        totalCost += product.cost * sale.quantity;
      }
    });
    
    return totalRevenue - totalCost;
  };
  
  const totalProfit = calculateProfit();
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-teal-600" />
          Reports & Analytics
        </h1>
        
        <div className="mt-3 sm:mt-0">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
            {totalProfit >= 0 ? (
              <ArrowUp className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <p className={`mt-2 text-3xl font-semibold ${
            totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${Math.abs(totalProfit).toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Profit Margin: {profitMargin.toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Items Sold</h3>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{totalItems}</p>
          <p className="mt-2 text-sm text-gray-500">
            {filteredSales.length} transactions
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-teal-50 border-b border-teal-100">
          <h2 className="font-medium text-teal-800 flex items-center">
            <Package className="mr-2 h-5 w-5 text-teal-600" />
            Top Selling Products
          </h2>
        </div>
        
        {topProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No sales data available for the selected time period.
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {product.name}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      ${product.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex bg-gray-200 rounded-full">
                    <div
                      style={{
                        width: `${(product.revenue / topProducts[0].revenue) * 100}%`,
                      }}
                      className="bg-teal-600 rounded-full"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;