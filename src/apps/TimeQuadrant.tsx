import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/todo/Sidebar';
import { Quadrant } from '../components/todo/Quadrant';
import { AddTodoModal } from '../components/todo/AddTodoModal';
import { useTodoStore } from '../store/todoStore';

export const TimeQuadrant: React.FC = () => {
  const { fetchTodos, isLoading } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetQuadrant, setTargetQuadrant] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = (quadrant: 1 | 2 | 3 | 4) => {
    setTargetQuadrant(quadrant);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full bg-[#000000] items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-[#000000] text-white overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <Quadrant 
            quadrant={1} 
            title="Urgent & Important" 
            dotColorClass="bg-red-500"
            headerBgClass="bg-red-500/10"
            onAdd={() => handleAddTodo(1)} 
          />
          <Quadrant 
            quadrant={2} 
            title="Not Urgent & Important" 
            dotColorClass="bg-blue-500"
            headerBgClass="bg-blue-500/10"
            onAdd={() => handleAddTodo(2)} 
          />
          <Quadrant 
            quadrant={3} 
            title="Urgent & Not Important" 
            dotColorClass="bg-orange-500"
            headerBgClass="bg-orange-500/10"
            onAdd={() => handleAddTodo(3)} 
          />
          <Quadrant 
            quadrant={4} 
            title="Not Urgent & Not Important" 
            dotColorClass="bg-green-500"
            headerBgClass="bg-green-500/10"
            onAdd={() => handleAddTodo(4)} 
          />
        </div>
      </div>

      <AddTodoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultQuadrant={targetQuadrant}
      />
    </div>
  );
};
