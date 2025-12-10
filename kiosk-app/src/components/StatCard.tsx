import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  color: 'red' | 'green' | 'blue';
  subtitle: string;
  trend?: 'up';
}

export function StatCard({ title, value, color, subtitle, trend }: StatCardProps) {
  const colorClasses = {
    red: 'text-red-500',
    green: 'text-green-500',
    blue: 'text-[#2563EB]'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="text-gray-600 mb-2">{title}</div>
      <div className={`text-4xl mb-2 ${colorClasses[color]}`}>
        {value}
        {trend && <TrendingUp className="inline-block w-6 h-6 ml-2" />}
      </div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );
}
