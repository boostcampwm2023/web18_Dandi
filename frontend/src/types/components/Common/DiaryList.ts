import { viewTypes } from '@type/pages/MyDiary';

export interface IDiaryContent {
  createdAt: string;
  profileImage?: string;
  nickname?: string;
  thumbnail?: string;
  title: string;
  content?: string;
  summary?: string;
  tags: string[];
  emotion: string;
  reactionCount: number;
  authorId?: string | number;
  diaryId: string | number;
}

export interface InfiniteDiaryListProps {
  pages: {
    nickname: string;
    diaryList: IDiaryContent[];
  }[];
  pageParams: {
    userId: string;
    type: viewTypes;
    lastIndex: number;
  }[];
}
