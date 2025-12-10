import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Analytics() {
  const revenueData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 3800 },
    { month: 'Mar', revenue: 5100 },
    { month: 'Apr', revenue: 4700 },
    { month: 'May', revenue: 6200 },
    { month: 'Jun', revenue: 5800 }
  ];

  const requestData = [
    { day: 'Mon', requests: 23 },
    { day: 'Tue', requests: 31 },
    { day: 'Wed', requests: 28 },
    { day: 'Thu', requests: 35 },
    { day: 'Fri', requests: 42 },
    { day: 'Sat', requests: 38 },
    { day: 'Sun', requests: 25 }
  ];

  const categoryData = [
    { name: 'Footwear', value: 30, color: '#111827' },
    { name: 'Outerwear', value: 25, color: '#374151' },
    { name: 'Formal Wear', value: 20, color: '#6B7280' },
    { name: 'Denim', value: 15, color: '#9CA3AF' },
    { name: 'Others', value: 10, color: '#D1D5DB' }
  ];

  const metrics = [
    { 
      label: 'Total Revenue', 
      value: '$28,400', 
      change: '+15.2%', 
      icon: DollarSign
    },
    { 
      label: 'Customer Satisfaction', 
      value: '87%', 
      change: '+3.1%', 
      icon: Users
    },
    { 
      label: 'Total Requests', 
      value: '222', 
      change: '+8.4%', 
      icon: ShoppingCart
    },
    { 
      label: 'Avg Response Time', 
      value: '2.4m', 
      change: '-12.5%', 
      icon: BarChart3
    }
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Analytics Dashboard</h1>
        <p className="text-gray-500 text-sm">Track your performance and insights</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-1">
                  <TrendingUp className={`w-3 h-3 ${metric.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`} />
                  <span className={`text-xs ${metric.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="text-2xl text-gray-900">{metric.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Requests Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-6">Weekly Requests</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={requestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#111827" 
                strokeWidth={2}
                dot={{ fill: '#111827', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm text-gray-900 mb-6">Category Distribution</h3>
        <div className="flex items-center justify-center gap-16">
          <ResponsiveContainer width={360} height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-700 w-28">{category.name}</span>
                <span className="text-sm text-gray-500">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
