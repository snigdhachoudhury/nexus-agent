interface RequestCardProps {
  customerName: string;
  customerAvatar: string;
  timestamp: string;
  preview: string;
  productImage: string;
  priority: 'High' | 'Medium';
}

export function RequestCard({
  customerName,
  customerAvatar,
  timestamp,
  preview,
  productImage,
  priority
}: RequestCardProps) {
  const priorityColors = {
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Customer Info */}
        <img
          src={customerAvatar}
          alt={customerName}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-gray-900">{customerName}</div>
              <div className="text-sm text-gray-500">{timestamp}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs ${priorityColors[priority]}`}>
              {priority}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{preview}</p>
          
          <div className="flex items-center justify-between">
            <img
              src={productImage}
              alt="Product"
              className="w-20 h-20 rounded-lg object-cover"
            />
            
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Assist Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
