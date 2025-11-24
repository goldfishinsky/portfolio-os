import React from 'react';
import { Calendar, Clock, CalendarDays, Infinity as InfinityIcon } from 'lucide-react';
import { useTodoStore } from '../../store/todoStore';

export const Sidebar: React.FC = () => {
  const { filter, setFilter } = useTodoStore();

  const filters = [
    { id: 'week', label: 'This Week', icon: Clock },
    { id: 'month', label: 'This Month', icon: Calendar },
    { id: 'year', label: 'This Year', icon: CalendarDays },
    { id: 'all', label: 'All Time', icon: InfinityIcon },
  ] as const;

  return (
    <div className="w-48 bg-[#1c1c1e] border-r border-white/10 flex flex-col p-3">
      <div className="mb-6 px-2 pt-2">
        <h2 className="text-lg font-bold text-white">Focus</h2>
        <p className="text-xs text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <nav className="space-y-1">
        {filters.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              filter === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
