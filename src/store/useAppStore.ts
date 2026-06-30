import { create } from 'zustand';
import type { NavTab } from '../types/database.types';
import { format } from 'date-fns';

interface AppState {
  activeDate: string;
  folderExpanded: boolean;
  addTaskOpen: boolean;
  activeNav: NavTab;
  setActiveDate: (d: string) => void;
  setFolderExpanded: (v: boolean) => void;
  setAddTaskOpen: (v: boolean) => void;
  setActiveNav: (nav: NavTab) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeDate: format(new Date(), 'yyyy-MM-dd'),
  folderExpanded: false,
  addTaskOpen: false,
  activeNav: 'home',
  setActiveDate: (activeDate) => set({ activeDate }),
  setFolderExpanded: (folderExpanded) => set({ folderExpanded }),
  setAddTaskOpen: (addTaskOpen) => set({ addTaskOpen }),
  setActiveNav: (activeNav) => set({ activeNav }),
}));
