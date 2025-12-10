import { Filter, SortDesc } from 'lucide-react';
import type { Request } from '../../App';

interface ActiveRequestsProps {
  onAssistNow: (request: Request) => void;
  onViewDetails: (request: Request) => void;
}

export function ActiveRequests({ onAssistNow, onViewDetails }: ActiveRequestsProps) {
  const allRequests: Request[] = [
    {
      id: 1,
      customerName: 'Michael Chen',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      timestamp: '2 mins ago',
      preview: 'Looking for formal blazer, summer wedding',
      productImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
      priority: 'High',
      status: 'pending',
      description: 'Customer needs a formal blazer for an upcoming summer wedding.',
      productName: 'Formal Blazer',
      category: 'Mens Formal Wear'
    },
    {
      id: 2,
      customerName: 'Emma Rodriguez',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      timestamp: '5 mins ago',
      preview: 'Need help finding running shoes size 8',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      priority: 'High',
      status: 'pending',
      description: 'Looking for lightweight running shoes with good cushioning.',
      productName: 'Running Shoes',
      category: 'Athletic Footwear'
    },
    {
      id: 3,
      customerName: 'James Wilson',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      timestamp: '12 mins ago',
      preview: 'Questions about leather jacket care instructions',
      productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop',
      priority: 'Medium',
      status: 'in-progress',
      description: 'Questions about proper leather jacket care and maintenance.',
      productName: 'Leather Jacket',
      category: 'Outerwear'
    },
    {
      id: 4,
      customerName: 'Olivia Martinez',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      timestamp: '18 mins ago',
      preview: 'Looking for sustainable denim options',
      productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      priority: 'Medium',
      status: 'pending',
      description: 'Interested in eco-friendly and sustainable denim jeans.',
      productName: 'Sustainable Denim',
      category: 'Sustainable Fashion'
    },
    {
      id: 5,
      customerName: 'David Kim',
      customerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      timestamp: '25 mins ago',
      preview: 'Need winter coat recommendations',
      productImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop',
      priority: 'Low',
      status: 'pending',
      description: 'Looking for a warm winter coat suitable for cold climates.',
      productName: 'Winter Coat',
      category: 'Outerwear'
    }
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Active Requests</h1>
          <p className="text-gray-500 text-sm">Manage all customer assistance requests</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <SortDesc className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '5' },
          { label: 'Pending', value: '4' },
          { label: 'In Progress', value: '1' },
          { label: 'High Priority', value: '2' }
        ].map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="text-2xl text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {allRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              <img
                src={request.customerAvatar}
                alt={request.customerName}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-900">{request.customerName}</div>
                    <div className="text-xs text-gray-400">{request.timestamp}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs ${
                      request.status === 'pending' 
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : request.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {request.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs ${
                      request.priority === 'High' 
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : request.priority === 'Medium'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {request.priority}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">{request.preview}</p>
                <div className="text-xs text-gray-400 mb-3">{request.category}</div>
                
                <div className="flex items-center justify-between">
                  <img
                    src={request.productImage}
                    alt="Product"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetails(request)}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onAssistNow(request)}
                      className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Assist Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
