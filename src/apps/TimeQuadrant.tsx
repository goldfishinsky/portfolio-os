import React, { useEffect } from 'react';
import { Sidebar } from '../components/todo/Sidebar';
import { Quadrant } from '../components/todo/Quadrant';
import { useTodoStore } from '../store/todoStore';

export const TimeQuadrant: React.FC = () => {
  const { fetchTodos, isLoading } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full bg-[#000000] items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-gray-900 via-[#1c1c1e] to-black text-white overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col p-6 gap-6">
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          <Quadrant 
            quadrant={1} 
            title="Urgent & Important" 
            dotColorClass="bg-red-500"
            headerBgClass="bg-red-500/10"
            containerBgClass="bg-red-500/5 hover:bg-red-500/10"
          />
          <Quadrant 
            quadrant={2} 
            title="Not Urgent & Important" 
            dotColorClass="bg-blue-500"
            headerBgClass="bg-blue-500/10"
            containerBgClass="bg-blue-500/5 hover:bg-blue-500/10"
          />
          <Quadrant 
            quadrant={3} 
            title="Urgent & Not Important" 
            dotColorClass="bg-orange-500"
            headerBgClass="bg-orange-500/10"
            containerBgClass="bg-orange-500/5 hover:bg-orange-500/10"
          />
          <Quadrant 
            quadrant={4} 
            title="Not Urgent & Not Important" 
            dotColorClass="bg-emerald-500"
            headerBgClass="bg-emerald-500/10"
            containerBgClass="bg-emerald-500/5 hover:bg-emerald-500/10"
          />
        </div>
      </div>
    </div>
  );
};
