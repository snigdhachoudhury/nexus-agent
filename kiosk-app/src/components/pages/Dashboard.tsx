import { TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import type { Request } from '../../App';

interface DashboardProps {
  onAssistNow: (request: Request) => void;
  onViewDetails: (request: Request) => void;
}

export function Dashboard({ onAssistNow, onViewDetails }: DashboardProps) {
  const stats = [
    {
      title: 'Active Requests',
      value: '5',
      icon: Zap,
      subtitle: '+2 from yesterday',
      trend: true
    },
    {
      title: 'Completed Today',
      value: '23',
      icon: CheckCircle2,
      subtitle: '87% satisfaction rate'
    },
    {
      title: 'Avg Response Time',
      value: '2.4m',
      icon: Clock,
      subtitle: '-15s improvement'
    }
  ];

  const requests: Request[] = [
    {
      id: 1,
      customerName: 'Michael Chen',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      timestamp: '2 mins ago',
      preview: 'Looking for formal blazer, summer wedding',
      productImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
      priority: 'High',
      status: 'pending',
      description: 'Customer needs a formal blazer for an upcoming summer wedding. Prefers navy or charcoal colors. Budget around $300-500.',
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
      description: 'Looking for lightweight running shoes with good cushioning for marathon training. Size 8, neutral pronation.',
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
      status: 'pending',
      description: 'Recently purchased a leather jacket and has questions about proper care and maintenance.',
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
      description: 'Interested in eco-friendly and sustainable denim jeans. Prefers organic cotton and recycled materials.',
      productName: 'Sustainable Denim',
      category: 'Sustainable Fashion'
    }
  ];

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, Sarah! You have 5 pending requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm text-gray-500">{stat.title}</div>
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl text-gray-900">{stat.value}</div>
                {stat.trend && <TrendingUp className="w-5 h-5 text-green-600 mb-1" />}
              </div>
              <div className="text-xs text-gray-400">{stat.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Active Requests */}
      <div>
        <h2 className="text-lg text-gray-900 mb-4">Active Customer Requests</h2>
        <div className="space-y-3">
          {requests.map((request) => (
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
                    <span className={`px-2.5 py-1 rounded text-xs ${
                      request.priority === 'High' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {request.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{request.preview}</p>
                  
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
    </div>
  );
}
