import { useState, useEffect } from 'react';
import { ShoppingCart, User, Trash2, Eye, Heart, Package } from 'lucide-react';

export function CustomerCarts() {
  const [carts, setCarts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('carts');

  useEffect(() => {
    fetchCartsAndWishlists();
    // Refresh every 10 seconds
    const interval = setInterval(fetchCartsAndWishlists, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCartsAndWishlists = async () => {
    try {
      // Fetch all carts
      const cartsResponse = await fetch('http://localhost:5000/api/cart/all');
      if (cartsResponse.ok) {
        const cartsData = await cartsResponse.json();
        setCarts(cartsData.data || []);
      }

      // Fetch all wishlists
      const wishlistsResponse = await fetch('http://localhost:5000/api/wishlist/all');
      if (wishlistsResponse.ok) {
        const wishlistsData = await wishlistsResponse.json();
        setWishlists(wishlistsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching carts/wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalValue = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading customer data...</p>
        </div>
      </div>
    );
  }

  const displayData = activeTab === 'carts' ? carts : wishlists;

  return (
    <div className="h-full">
      {/* Modern Header with Gradient */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Customer Activity
            </h1>
            <p className="text-gray-500 text-lg">
              Real-time monitoring of shopping carts and wishlists
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 font-semibold">● Live</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Auto-refresh: <span className="font-semibold">10s</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('carts')}
          className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'carts'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <span>Shopping Carts</span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
              activeTab === 'carts' 
                ? 'bg-white/30 text-white' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {carts.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('wishlists')}
          className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'wishlists'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5" />
            <span>Wishlists</span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
              activeTab === 'wishlists' 
                ? 'bg-white/30 text-white' 
                : 'bg-pink-100 text-pink-700'
            }`}>
              {wishlists.length}
            </span>
          </div>
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">Total Carts</p>
                <p className="text-4xl font-black">{carts.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-lg font-semibold">
                {carts.reduce((sum, c) => sum + (c.items?.length || 0), 0)} items
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-pink-500/30 transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">Total Wishlists</p>
                <p className="text-4xl font-black">{wishlists.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-lg font-semibold">
                {wishlists.reduce((sum, w) => sum + (w.items?.length || 0), 0)} items
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-green-500/30 transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">Total Items</p>
                <p className="text-4xl font-black">
                  {displayData.reduce((sum, d) => sum + (d.items?.length || 0), 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-lg font-semibold">
                Active now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      {displayData.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'carts' ? (
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              ) : (
                <Heart className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <p className="text-gray-600 text-2xl font-bold mb-3">
              No {activeTab === 'carts' ? 'carts' : 'wishlists'} yet
            </p>
            <p className="text-gray-400 text-lg">
              Customer {activeTab} will appear here once they start adding items
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayData.map((data: any) => (
              <div
                key={data._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{data.userId}</h3>
                      <p className="text-sm text-gray-500">
                        Session: <span className="font-mono">{data.sessionId?.substring(0, 8)}...</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                      {formatDate(data.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700">
                      Items ({data.items?.length || 0})
                    </p>
                  </div>
                  {data.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all group/item"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg blur opacity-0 group-hover/item:opacity-30 transition-opacity"></div>
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/60'}
                          alt={item.name}
                          className="relative w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            Aisle {item.aisle}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${item.price?.toFixed(2)}
                        </p>
                        {activeTab === 'carts' && item.quantity && (
                          <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded">
                            Qty: {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                {activeTab === 'carts' && data.items?.length > 0 && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-600">Total Value</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${getTotalValue(data.items).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
