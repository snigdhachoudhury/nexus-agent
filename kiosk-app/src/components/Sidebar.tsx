import { LayoutDashboard, ShoppingBag, Package, BarChart3, Settings, ShoppingCart, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null, color: 'from-blue-500 to-cyan-500' },
    { id: 'active-requests', icon: ShoppingBag, label: 'Active Requests', badge: '5', color: 'from-orange-500 to-red-500' },
    { id: 'customer-carts', icon: ShoppingCart, label: 'Customer Activity', badge: null, color: 'from-purple-500 to-pink-500' },
    { id: 'inventory', icon: Package, label: 'Inventory', badge: null, color: 'from-green-500 to-emerald-500' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null, color: 'from-indigo-500 to-purple-500' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null, color: 'from-gray-500 to-slate-500' }
  ];

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-[280px] bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg">
          <Sparkles className="w-6 h-6" />
          <div>
            <p className="font-bold text-sm">AI-Powered</p>
            <p className="text-xs opacity-90">Smart Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg scale-[1.02]'
                      : 'text-gray-600 hover:bg-gray-50 hover:scale-[1.01]'
                  }`}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r opacity-30 blur-xl -z-10"></div>
                  )}
                  
                  {/* Icon with background */}
                  <div className={`p-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <span className="flex-1 text-left">{item.label}</span>
                  
                  {item.badge && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isActive
                        ? 'bg-white/30 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Hover effect line */}
                  {!isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r transition-all duration-300"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gradient-to-t from-white to-transparent">
        <div className="text-center text-xs text-gray-400">
          <p className="font-medium">NEXUS v2.0</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}
