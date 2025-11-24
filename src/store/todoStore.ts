import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  quadrant: 1 | 2 | 3 | 4;
  due_date?: string;
  is_completed: boolean;
  created_at: string;
  user_id?: string;
}

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  filter: 'week' | 'month' | 'year' | 'all';
  
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  toggleTodo: (id: string, is_completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodoQuadrant: (id: string, quadrant: 1 | 2 | 3 | 4) => Promise<void>;
  setFilter: (filter: 'week' | 'month' | 'year' | 'all') => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  filter: 'all',

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ todos: data || [] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (newTodo) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ todos: [data, ...state.todos] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  toggleTodo: async (id, is_completed) => {
    try {
      // Optimistic update
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, is_completed } : t
        ),
      }));

      const { error } = await supabase
        .from('todos')
        .update({ is_completed })
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message });
      // Revert on error (could be improved by refetching)
      get().fetchTodos();
    }
  },

  deleteTodo: async (id) => {
    try {
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
      }));

      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message });
      get().fetchTodos();
    }
  },

  updateTodoQuadrant: async (id, quadrant) => {
    try {
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, quadrant } : t
        ),
      }));

      const { error } = await supabase
        .from('todos')
        .update({ quadrant })
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message });
      get().fetchTodos();
    }
  },

  setFilter: (filter) => set({ filter }),
}));
