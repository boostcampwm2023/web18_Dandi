import { create } from 'zustand';

interface editState {
  title: string;
  setTitle: (newTitle: string) => void;

  emoji: string;
  setEmoji: (newEmoji: string) => void;

  thumbnail: string;
  setThumbnail: (newThumbnail: string) => void;

  content: string;
  setContent: (newContent: string) => void;

  keywordList: string[];
  setKeywordList: (newKeywordList: string[]) => void;

  status: '공개 하기' | '나만 보기';
  setStatus: (newStatus: '공개 하기' | '나만 보기') => void;
}

const useEditStore = create<editState>((set) => ({
  title: '',
  setTitle: (newTitle) => set({ title: newTitle }),

  emoji: '😁',
  setEmoji: (newEmoji) => set({ emoji: newEmoji }),

  thumbnail: '',
  setThumbnail: (newThumbnail) => set({ thumbnail: newThumbnail }),

  content: ' ',
  setContent: (newContent) => set({ content: newContent }),

  keywordList: [],
  setKeywordList: (newKeywordList) => set({ keywordList: newKeywordList }),

  status: '나만 보기',
  setStatus: (newStatus) => set({ status: newStatus }),
}));

export default useEditStore;
