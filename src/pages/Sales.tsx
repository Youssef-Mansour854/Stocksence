import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sale, Product } from '../types';
import { useAlert } from '../context/AlertContext';
import SalesList from '../components/sales/SalesList';
import SaleForm from '../components/sales/SaleForm';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const { showAlert } = useAlert();
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      // Fetch sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false });
        
      if (salesError) throw salesError;
      
      // Fetch products for the sale form
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .gt('quantity', 0);
        
      if (productsError) throw productsError;
      
      setSales(salesData as Sale[]);
      setProducts(productsData as Product[]);
    } catch (error: any) {
      showAlert('error', error.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSale = async (productId: string, quantity: number) => {
    try {
      // Find the product
      const product = products.find((p) => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      // Calculate total price
      const totalPrice = product.price * quantity;
      
      // Begin a transaction
      // 1. Insert the sale record
      const { data: saleData, error: saleError } = await supabase.from('sales').insert({
        productId,
        productName: product.name,
        quantity,
        totalPrice,
        date: new Date().toISOString(),
      }).select();
      
      if (saleError) throw saleError;
      
      // 2. Update the product quantity
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity: product.quantity - quantity,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', productId);
        
      if (updateError) throw updateError;
      
      // Update the UI
      setSales([saleData[0] as Sale, ...sales]);
      setProducts(
        products.map((p) =>
          p.id === productId
            ? { ...p, quantity: p.quantity - quantity }
            : p
        )
      );
      
      setShowForm(false);
    } catch (error: any) {
      showAlert('error', error.message || 'Error recording sale');
      throw error;
    }
  };
  
  const handleAddNew = () => {
    setShowForm(true);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
      
      {showForm ? (
        <SaleForm
          products={products}
          onSubmit={handleAddSale}
          onCancel={handleFormCancel}
        />
      ) : (
        <SalesList sales={sales} onAddNew={handleAddNew} />
      )}
    </div>
  );
};

export default Sales;