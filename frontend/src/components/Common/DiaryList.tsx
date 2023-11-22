import DiaryListItem from '@components/Common/DiaryListItem';
import { IDiaryContent } from '@/src/types/components/Common/DiaryList';

interface DiaryList {
  pageType: string;
  diaryData: IDiaryContent[];
}

const DiaryList = ({ pageType, diaryData }: DiaryList) => {
  const { nickname } = diaryData[0];
  const pageTitle = pageType === 'home' ? `${nickname}님의 일기 목록` : '친구들의 일기';

  const content = diaryData.map((data: IDiaryContent, index) => (
    <DiaryListItem key={index} pageType={pageType} diaryItem={data} />
  ));

  return (
    <div className="w-[60%] p-5">
      <h1 className="mb-5 text-2xl font-bold text-[black]">{pageTitle}</h1>
      {content}
    </div>
  );
};

export default DiaryList;
