import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useAlert } from '../../context/AlertContext';
import { ShoppingCart, Search, X } from 'lucide-react';

interface SaleFormProps {
  products: Product[];
  onSubmit: (productId: string, quantity: number) => Promise<void>;
  onCancel: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ products, onSubmit, onCancel }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { showAlert } = useAlert();
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.quantity > 0
      );
      setFilteredProducts(filtered);
      setShowDropdown(true);
    } else {
      setFilteredProducts([]);
      setShowDropdown(false);
    }
  }, [searchTerm, products]);
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setShowDropdown(false);
    setQuantity(1);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      if (selectedProduct && value <= selectedProduct.quantity) {
        setQuantity(value);
      } else if (selectedProduct) {
        setQuantity(selectedProduct.quantity);
        showAlert('warning', `Maximum available quantity is ${selectedProduct.quantity}`);
      }
    } else {
      setQuantity(1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      showAlert('error', 'Please select a product');
      return;
    }
    
    if (quantity <= 0) {
      showAlert('error', 'Quantity must be greater than 0');
      return;
    }
    
    if (quantity > selectedProduct.quantity) {
      showAlert('error', `Only ${selectedProduct.quantity} items available in stock`);
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit(selectedProduct.id, quantity);
      setSelectedProduct(null);
      setSearchTerm('');
      setQuantity(1);
      showAlert('success', 'Sale recorded successfully');
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to record sale');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5 text-teal-600" />
          Record New Sale
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
              Product*
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a product..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
              
              {showDropdown && filteredProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-gray-500">In stock: {product.quantity}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {showDropdown && filteredProducts.length === 0 && searchTerm && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-4 text-center">
                  <p className="text-sm text-gray-500">No products found or out of stock</p>
                </div>
              )}
            </div>
          </div>
          
          {selectedProduct && (
            <div className="bg-teal-50 p-4 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-teal-700">${selectedProduct.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.quantity} available
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity*
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={selectedProduct?.quantity || 1}
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              disabled={!selectedProduct}
            />
          </div>
          
          {selectedProduct && (
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="text-lg font-bold text-teal-700">
                  ${(selectedProduct.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedProduct || loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Record Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;