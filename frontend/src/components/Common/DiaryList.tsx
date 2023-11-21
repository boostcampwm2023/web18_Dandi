import DiaryListItem from '@components/Common/DiaryListItem';

interface DiaryListProps {
  pageType: string;
  diaryData: IDiaryContent[];
}

export interface IDiaryContent {
  createdAt: string;
  profileImage: string;
  nickname: string;
  thumbnail: string;
  title: string;
  content: string;
  keywords: string[];
  reactionCount: number;
}

const DiaryList = ({ pageType, diaryData }: DiaryListProps) => {
  const { nickname } = diaryData[0];
  const pageTitle = pageType === 'home' ? `${nickname}님의 일기 목록` : '친구들의 일기';

  const content = diaryData.map((data: IDiaryContent, index) => (
    <DiaryListItem key={index} pageType={pageType} {...data} />
  ));

  return (
    <div className="w-[60%] p-5">
      <h1 className="mb-5 text-2xl font-bold text-[black]">{pageTitle}</h1>
      {content}
    </div>
  );
};

export default DiaryList;
