import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DashboardStats, Product, Sale } from '../types';
import { useAlert } from '../context/AlertContext';
import DashboardCard from '../components/dashboard/DashboardCard';
import LowStockList from '../components/dashboard/LowStockList';
import RecentSales from '../components/dashboard/RecentSales';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSales: 0,
    revenue: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { showAlert } = useAlert();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
          
        if (productsError) throw productsError;
        
        const products = productsData as Product[];
        const lowStock = products.filter(
          (product) => product.quantity <= product.minQuantity
        );
        
        // Fetch recent sales
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
          
        if (salesError) throw salesError;
        
        const sales = salesData as Sale[];
        
        // Fetch total sales count
        const { count: salesCount, error: countError } = await supabase
          .from('sales')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        // Calculate total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('sales')
          .select('totalPrice');
          
        if (revenueError) throw revenueError;
        
        const totalRevenue = revenueData.reduce(
          (sum, sale) => sum + sale.totalPrice,
          0
        );
        
        setStats({
          totalProducts: products.length,
          lowStockProducts: lowStock.length,
          totalSales: salesCount || 0,
          revenue: totalRevenue,
        });
        
        setLowStockProducts(lowStock);
        setRecentSales(sales);
      } catch (error: any) {
        showAlert('error', error.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [showAlert]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <DashboardCard
          title="Low Stock Items"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          color="amber"
        />
        <DashboardCard
          title="Total Sales"
          value={stats.totalSales}
          icon={ShoppingCart}
          color="green"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          icon={DollarSign}
          color="teal"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alerts</h2>
          <LowStockList products={lowStockProducts} />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Sales</h2>
          <RecentSales sales={recentSales} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;