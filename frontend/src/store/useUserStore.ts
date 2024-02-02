import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface userState {
  userId: number;
  setUserId: (newUserId: number) => void;
}

const useUserStore = create(
  persist<userState>(
    (set) => ({
      userId: 0,
      setUserId: (newUserId) => set({ userId: newUserId }),
    }),
    {
      name: 'userIdStorage',
    },
  ),
);

export default useUserStore;
