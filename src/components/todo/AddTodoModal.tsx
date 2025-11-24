import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTodoStore } from '../../store/todoStore';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuadrant?: 1 | 2 | 3 | 4;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, onClose, defaultQuadrant = 1 }) => {
  const { addTodo } = useTodoStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadrant, setQuadrant] = useState<1 | 2 | 3 | 4>(defaultQuadrant);
  const [dueDate, setDueDate] = useState('');

  // Reset form when opening with a new default quadrant
  React.useEffect(() => {
    if (isOpen) {
      setQuadrant(defaultQuadrant);
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  }, [isOpen, defaultQuadrant]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTodo({
      title,
      description,
      quadrant,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      is_completed: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2c2c2e] w-full max-w-md rounded-xl border border-white/10 shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-20"
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Quadrant</label>
              <select
                value={quadrant}
                onChange={(e) => setQuadrant(Number(e.target.value) as 1 | 2 | 3 | 4)}
                className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value={1}>Urgent & Important</option>
                <option value={2}>Not Urgent & Important</option>
                <option value={3}>Urgent & Not Important</option>
                <option value={4}>Not Urgent & Not Important</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
