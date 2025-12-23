import React from 'react';
import { useTodoStore } from '../../store/todoStore';
import { TodoItem } from './TodoItem';
import { Plus } from 'lucide-react';

interface QuadrantProps {
  quadrant: 1 | 2 | 3 | 4;
  title: string;
  dotColorClass: string; // e.g. "bg-red-500"
  headerBgClass: string; // e.g. "bg-red-500/5"
  containerBgClass: string; // e.g. "bg-red-500/5"
}

export const Quadrant: React.FC<QuadrantProps> = ({ 
  quadrant, 
  title, 
  dotColorClass, 
  headerBgClass, 
  containerBgClass,
}) => {
  const { todos, filter, addTodo, updateTodoQuadrant } = useTodoStore();
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

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

  const handleSave = async () => {
    if (newTaskTitle.trim()) {
      await addTodo({
        title: newTaskTitle,
        quadrant,
        is_completed: false,
      });
      setNewTaskTitle('');
      setIsAdding(false);
    } else {
      setIsAdding(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleSave();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTaskTitle('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const todoId = e.dataTransfer.getData('todoId');
    if (todoId) {
      await updateTodoQuadrant(todoId, quadrant);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full ${containerBgClass} backdrop-blur-2xl rounded-2xl border transition-all overflow-hidden shadow-2xl relative
        ${isDraggingOver ? 'border-white/40 ring-2 ring-white/20 bg-white/10' : 'border-white/10 hover:border-white/20 ring-1 ring-white/5'}
      `}
    >
      <div className={`px-4 py-3 border-b border-white/5 flex justify-between items-center ${headerBgClass} backdrop-blur-md`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColorClass} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
          <h3 className="text-sm font-semibold text-white/90 tracking-wide">{title}</h3>
          <span className="text-[10px] font-medium text-white/50 bg-white/10 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            {filteredTodos.length}
          </span>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
        {isAdding && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              autoFocus
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder="Type a new task..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all backdrop-blur-sm"
            />
          </div>
        )}

        {filteredTodos.length === 0 && !isAdding ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20 text-xs">
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
