import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types/database.types';

export const useTasks = (date: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    supabase
      .from('tasks')
      .select('*')
      .eq('due_date', date)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setTasks(data ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel(`tasks:${date}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `due_date=eq.${date}`,
      }, payload => {
        if (payload.eventType === 'INSERT')
          setTasks(prev => [...prev, payload.new as Task]
            .sort((a, b) => a.sort_order - b.sort_order));
        if (payload.eventType === 'UPDATE')
          setTasks(prev => prev
            .map(t => t.id === payload.new.id ? payload.new as Task : t)
            .sort((a, b) => a.sort_order - b.sort_order));
        if (payload.eventType === 'DELETE')
          setTasks(prev => prev.filter(t => t.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [date]);

  return { tasks, loading };
};
