import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useAlert } from '../context/AlertContext';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { showAlert } = useAlert();
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setProducts(data as Product[]);
    } catch (error: any) {
      showAlert('error', error.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase.from('products').insert({
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).select();
      
      if (error) throw error;
      
      setProducts([...products, data[0] as Product]);
      setShowForm(false);
    } catch (error: any) {
      showAlert('error', error.message || 'Error adding product');
      throw error;
    }
  };
  
  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProduct) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', editingProduct.id)
        .select();
        
      if (error) throw error;
      
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? (data[0] as Product) : product
        )
      );
      
      setEditingProduct(null);
      setShowForm(false);
    } catch (error: any) {
      showAlert('error', error.message || 'Error updating product');
      throw error;
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) throw error;
      
      setProducts(products.filter((product) => product.id !== id));
      showAlert('success', 'Product deleted successfully');
    } catch (error: any) {
      showAlert('error', error.message || 'Error deleting product');
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  
  const handleFormCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };
  
  const handleFormSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      await handleUpdateProduct(productData);
    } else {
      await handleAddProduct(productData);
    }
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
      <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
      
      {showForm ? (
        <ProductForm
          initialProduct={editingProduct || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAddNew={handleAddNew}
        />
      )}
    </div>
  );
};

export default Products;