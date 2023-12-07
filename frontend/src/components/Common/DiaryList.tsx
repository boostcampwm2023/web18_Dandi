import { IDiaryContent } from '@type/components/Common/DiaryList';

import disappointedFace from '@assets/image/disappointedFace.png';

import DiaryListItem from '@components/Common/DiaryListItem';

import { HOME, PAGE_TITLE_HOME, PAGE_TITLE_FEED } from '@util/constants';

interface DiaryList {
  pageType?: string;
  diaryData: IDiaryContent[];
  username?: string;
}

const DiaryList = ({ pageType, diaryData, username }: DiaryList) => {
  const pageTitle = pageType === HOME ? `${username} ${PAGE_TITLE_HOME}` : PAGE_TITLE_FEED;

  if (diaryData.length === 0) {
    return (
      <div className="mt-52 flex w-full flex-col items-center justify-center gap-3">
        <img className="w-1/5" src={disappointedFace} alt="피드가 없는 그림" />
        <p className="text-2xl font-bold">아직 친구가 없어서 보여드릴 피드가 없어요.</p>
      </div>
    );
  }
  return (
    <div className="w-3/5 p-5">
      <h1 className="mb-5 text-2xl font-bold">{pageTitle}</h1>
      {diaryData.map((data: IDiaryContent, index) => (
        <DiaryListItem key={index} pageType={pageType} diaryItem={data} />
      ))}
    </div>
  );
};

export default DiaryList;
