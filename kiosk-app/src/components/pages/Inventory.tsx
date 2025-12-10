import { Package, TrendingUp, TrendingDown, AlertCircle, Search } from 'lucide-react';

export function Inventory() {
  const inventoryStats = [
    { label: 'Total Items', value: '1,234', trend: 'up', change: '+12%' },
    { label: 'Low Stock', value: '23', trend: 'down', change: '-5%' },
    { label: 'Out of Stock', value: '7', trend: 'neutral', change: '0%' },
    { label: 'New Arrivals', value: '45', trend: 'up', change: '+18%' }
  ];

  const inventoryItems = [
    {
      id: 1,
      name: 'Premium Leather Jacket',
      sku: 'LJ-2024-001',
      category: 'Outerwear',
      stock: 45,
      price: 299.99,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Running Shoes Pro',
      sku: 'RS-2024-045',
      category: 'Footwear',
      stock: 8,
      price: 159.99,
      status: 'low-stock',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Formal Blazer Navy',
      sku: 'FB-2024-023',
      category: 'Formal Wear',
      stock: 0,
      price: 399.99,
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Sustainable Denim Jeans',
      sku: 'DJ-2024-067',
      category: 'Denim',
      stock: 120,
      price: 89.99,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'Winter Parka',
      sku: 'WP-2024-012',
      category: 'Outerwear',
      stock: 15,
      price: 249.99,
      status: 'low-stock',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'Cotton T-Shirt Basic',
      sku: 'CT-2024-089',
      category: 'Basics',
      stock: 250,
      price: 29.99,
      status: 'in-stock',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
    }
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Track and manage your product inventory</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-80 pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {inventoryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl text-gray-900 mb-2">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
              {stat.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
              <span className={`${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-2 gap-4">
        {inventoryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
          >
            <div className="flex gap-5">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs ${
                    item.status === 'in-stock'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : item.status === 'low-stock'
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Stock:</span>
                    <span className={`${item.stock === 0 ? 'text-red-600' : item.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {item.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Price:</span>
                    <span className="text-gray-900">${item.price}</span>
                  </div>
                </div>
                
                {item.stock < 10 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertCircle className="w-3 h-3 text-yellow-700" />
                    <span className="text-xs text-yellow-700">
                      {item.stock === 0 ? 'Restock immediately' : 'Low stock alert'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
