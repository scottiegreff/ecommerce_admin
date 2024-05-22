import { create } from "zustand";

interface SelectedRow {
  createdAt: string;
  email: string;
  employeeId: string;
  isActive: boolean;
  fName: string;
  lName: string;
  phone: string;
}
interface StoreState {
  selectedRow: SelectedRow | null;
  setSelectedRow: (row: SelectedRow | null) => void;
}

const useEmployeeSelectionStore = create<StoreState>((set) => ({
  selectedRow: null,
  setSelectedRow: (row) => set({ selectedRow: row }),
}));

export default useEmployeeSelectionStore;
