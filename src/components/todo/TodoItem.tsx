import React from 'react';
import { Trash2, Check, Pencil } from 'lucide-react';
import { type Todo, useTodoStore } from '../../store/todoStore';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo, updateTodo } = useTodoStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(todo.title);

  const handleUpdate = async () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      await updateTodo(todo.id, { title: editTitle });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('todoId', todo.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="group flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5 hover:border-white/10 mb-2 backdrop-blur-sm relative cursor-grab active:cursor-grabbing"
    >
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
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none p-0 text-sm font-medium text-white focus:ring-0 focus:outline-none"
          />
        ) : (
          <>
            <h4 
              onDoubleClick={() => setIsEditing(true)}
              className={`text-sm font-medium truncate transition-all cursor-text ${
                todo.is_completed ? 'text-gray-500 line-through' : 'text-gray-200'
              }`}
            >
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
          </>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
           <button
             onClick={() => setIsEditing(true)}
             className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-all"
           >
             <Pencil size={14} />
           </button>
        )}
        <button
          onClick={() => deleteTodo(todo.id)}
          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
