import React from 'react';
import { useTodoStore } from '../../store/todoStore';
import { TodoItem } from './TodoItem';
import { Plus } from 'lucide-react';

interface QuadrantProps {
  quadrant: 1 | 2 | 3 | 4;
  title: string;
  dotColorClass: string; // e.g. "bg-red-500"
  headerBgClass: string; // e.g. "bg-red-500/5"
  onAdd: () => void;
}

export const Quadrant: React.FC<QuadrantProps> = ({ quadrant, title, dotColorClass, headerBgClass, onAdd }) => {
  const { todos, filter } = useTodoStore();

  const filteredTodos = todos.filter((t) => {
    if (t.quadrant !== quadrant) return false;
    
    // Time filtering logic
    if (filter === 'all') return true;
    if (!t.due_date) return true; 
    
    const date = new Date(t.due_date);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (filter === 'week' && diffDays > 7) return false;
    if (filter === 'month' && diffDays > 30) return false;
    if (filter === 'year' && diffDays > 365) return false;
    
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e]/50 rounded-xl border border-white/5 overflow-hidden">
      <div className={`px-4 py-3 border-b border-white/5 flex justify-between items-center ${headerBgClass}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColorClass}`} />
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
            {filteredTodos.length}
          </span>
        </div>
        <button 
          onClick={onAdd}
          className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {filteredTodos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs">
            <p>No tasks</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
};
