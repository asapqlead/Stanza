import type { Task } from '../types/database.types';

export const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => a.sort_order - b.sort_order);

export const pendingTasks = (tasks: Task[]): Task[] =>
  tasks.filter(t => !t.completed);

export const completedTasks = (tasks: Task[]): Task[] =>
  tasks.filter(t => t.completed);
