export interface IDiaryContent {
  createdAt: string;
  profileImage: string;
  nickname: string;
  thumbnail?: string;
  title: string;
  content?: string;
  summary?: string;
  tags: string[];
  reactionCount: number;
  authorId: string | number;
  diaryId: string | number;
}
