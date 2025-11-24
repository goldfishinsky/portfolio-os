import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { type Todo, useTodoStore } from '../../store/todoStore';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useTodoStore();

  return (
    <div className="group flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5 hover:border-white/10 mb-2">
      <button
        onClick={() => toggleTodo(todo.id, !todo.is_completed)}
        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          todo.is_completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-500 text-transparent hover:border-gray-400'
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </button>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate transition-all ${
          todo.is_completed ? 'text-gray-500 line-through' : 'text-gray-200'
        }`}>
          {todo.title}
        </h4>
        {todo.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
            {todo.description}
          </p>
        )}
        {todo.due_date && (
          <p className="text-[10px] text-gray-600 mt-1">
            {format(new Date(todo.due_date), 'MMM d, yyyy')}
          </p>
        )}
      </div>

      <button
        onClick={() => deleteTodo(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
