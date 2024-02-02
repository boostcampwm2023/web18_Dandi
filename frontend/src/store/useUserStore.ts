import { create } from 'zustand';

interface userState {
  userId: number;
  setUserId: (newUserId: number) => void;
}

const useUserStore = create<userState>((set) => ({
  userId: 0,
  setUserId: (newUserId) => set({ userId: newUserId }),
}));

export default useUserStore;
