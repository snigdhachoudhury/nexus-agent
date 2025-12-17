import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/pages/Dashboard';
import { ActiveRequests } from './components/pages/ActiveRequests';
import { CustomerCarts } from './components/pages/CustomerCarts';
import { Inventory } from './components/pages/Inventory';
import { Analytics } from './components/pages/Analytics';
import { Settings } from './components/pages/Settings';
import { Bell, Search, User } from 'lucide-react';

function AdminApp() {
  const [currentPage, setCurrentPage] = useState('customer-carts');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onAssistNow={() => {}} onViewDetails={() => {}} />;
      case 'active-requests':
        return <ActiveRequests />;
      case 'customer-carts':
        return <CustomerCarts />;
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onAssistNow={() => {}} onViewDetails={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Modern Header with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm z-50">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Animated Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-2xl">N</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                NEXUS Admin
              </h1>
              <p className="text-sm text-gray-500 font-medium">Real-time Store Intelligence</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, products, or sessions..."
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white transition-all border border-gray-200/50 group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Store Manager</p>
                <p className="text-xs opacity-90">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content with Padding */}
      <main className="ml-[280px] mt-20 p-8">
        <div className="max-w-[1600px] mx-auto">
          {renderPage()}
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default AdminApp;
