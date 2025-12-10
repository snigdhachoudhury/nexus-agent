import { X, Calendar, Clock, Tag, MapPin, CreditCard, Star, MessageCircle } from 'lucide-react';
import type { Request } from '../../App';

interface DetailsModalProps {
  request: Request;
  onClose: () => void;
  onAssist: () => void;
}

export function DetailsModal({ request, onClose, onAssist }: DetailsModalProps) {
  const customerHistory = [
    { date: 'Dec 8, 2024', item: 'Winter Jacket', amount: '$249.99', rating: 5 },
    { date: 'Nov 22, 2024', item: 'Running Shoes', amount: '$159.99', rating: 5 },
    { date: 'Oct 15, 2024', item: 'Casual T-Shirt', amount: '$29.99', rating: 4 }
  ];

  const recommendedProducts = [
    {
      name: 'Navy Formal Blazer',
      price: '$399.99',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
      stock: 'In Stock'
    },
    {
      name: 'Charcoal Suit Jacket',
      price: '$449.99',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop',
      stock: 'In Stock'
    },
    {
      name: 'Classic Black Blazer',
      price: '$379.99',
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=200&h=200&fit=crop',
      stock: 'Low Stock'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={request.customerAvatar}
              alt={request.customerName}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-base text-gray-900">{request.customerName}</h2>
              <p className="text-xs text-gray-500">Request #{request.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Request Details */}
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm text-gray-900">Request Details</h3>
                  <span className={`px-2.5 py-1 rounded text-xs ${
                    request.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {request.priority} Priority
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="text-sm text-gray-900">Dec 10, 2024</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="text-sm text-gray-900">{request.timestamp}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <Tag className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Category</div>
                      <div className="text-sm text-gray-900">{request.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-sm text-gray-900">Store - Section A3</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs text-gray-500 mb-2">Customer Message</div>
                  <p className="text-sm text-gray-900">{request.description || request.preview}</p>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm text-gray-900 mb-4">Recommended Products</h3>
                <div className="grid grid-cols-3 gap-3">
                  {recommendedProducts.map((product, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />
                      <div className="text-xs text-gray-900 mb-1">{product.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{product.price}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          product.stock === 'In Stock' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {product.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase History */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm text-gray-900 mb-4">Customer Purchase History</h3>
                <div className="space-y-2">
                  {customerHistory.map((purchase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">{purchase.item}</div>
                          <div className="text-xs text-gray-500">{purchase.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 mb-1">{purchase.amount}</div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(purchase.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Product Card */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm text-gray-900 mb-3">Product Interest</h3>
                <img
                  src={request.productImage}
                  alt="Product"
                  className="w-full h-44 rounded-lg object-cover mb-3"
                />
                <div className="text-sm text-gray-900 mb-1">{request.productName}</div>
                <div className="text-xs text-gray-500 mb-3">{request.category}</div>
                <div className="text-sm text-gray-900 mb-4">$299.99 - $499.99</div>
                <button className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                  View in Inventory
                </button>
              </div>

              {/* Customer Stats */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm text-gray-900 mb-3">Customer Stats</h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Total Purchases</span>
                    <span className="text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Lifetime Value</span>
                    <span className="text-gray-900">$2,847.89</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Avg Rating</span>
                    <span className="text-gray-900">4.8 ★</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Member Since</span>
                    <span className="text-gray-900">Aug 2023</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={onAssist}
                  className="w-full px-4 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Assist Customer
                </button>
                <button className="w-full px-4 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Schedule Call
                </button>
                <button className="w-full px-4 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
