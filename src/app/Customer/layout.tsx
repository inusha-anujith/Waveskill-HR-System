import CustomerNavigation from '@/components/CustomerNavi/CustomerNavigation';
import { LogOut } from 'lucide-react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      {/* Top Solid Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome, Client User</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors">
          <LogOut size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </header>

      {/* Navigation Tabs */}
      <CustomerNavigation />

      {/* Dynamic Page Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}