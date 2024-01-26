import { create } from 'zustand';

interface userState {
  userId: string;
  setUserId: (newUserId: string) => void;
}

const useUserStore = create<userState>((set) => ({
  userId: '',
  setUserId: (newUserId) => set({ userId: newUserId }),
}));

export default useUserStore;
