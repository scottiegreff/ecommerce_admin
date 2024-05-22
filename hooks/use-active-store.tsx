import { create } from 'zustand';

interface useActiveStoreInterface {
  id?: string;
  set: (id: string) => void;
  reset: () => void;
}

/**
 * Custom hook for managing the active store.
 * @returns An object with the following properties and methods:
 *   - id: The ID of the active store.
 *   - set: A function to set the ID of the active store.
 *   - reset: A function to reset the ID of the active store.
 */
export const useActiveStore = create<useActiveStoreInterface>((set) => ({
  id: undefined,
  set: (id: string) => set({ id }),
  reset: () => set({ id: undefined }),
}));
