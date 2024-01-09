import { create } from 'zustand';

import { viewTypes } from '@type/pages/MyDiary';

interface viewTypeState {
  viewType: viewTypes;
  setViewType:(newViewType: viewTypes) => void;
}

const useViewTypeStore = create<viewTypeState>((set) => ({
  viewType: 'Day',
  setViewType: (newViewType) => set({ viewType: newViewType }),
}));

export default useViewTypeStore;
