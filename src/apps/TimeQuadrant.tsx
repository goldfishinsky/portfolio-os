import React, { useEffect } from 'react';
import { Sidebar } from '../components/todo/Sidebar';
import { Quadrant } from '../components/todo/Quadrant';
import { useTodoStore } from '../store/todoStore';
import { useAuthStore } from '../store/authStore';
import { Lock } from 'lucide-react';

export const TimeQuadrant: React.FC = () => {
  const { fetchTodos, isLoading: isTodosLoading } = useTodoStore();
  const { user, signInWithGoogle, isLoading: isAuthLoading } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="flex h-full w-full bg-[#000000] items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full w-full bg-[#000000] items-center justify-center text-white gap-6">
        <div className="bg-white/10 p-6 rounded-full">
            <Lock size={48} className="text-gray-400" />
        </div>
        <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Please sign in with Google to access your Time Quadrant todos.
            </p>
        </div>
        <button 
            onClick={signInWithGoogle}
            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
            Sign in with Google
        </button>
      </div>
    );
  }

  if (isTodosLoading) {
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
