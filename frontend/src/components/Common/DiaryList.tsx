import { IDiaryContent } from '@type/components/Common/DiaryList';

import DiaryListItem from '@components/Common/DiaryListItem';

import { HOME, PAGE_TITLE_HOME, PAGE_TITLE_FEED } from '@util/constants';

interface DiaryList {
  pageType: string;
  diaryData: IDiaryContent[];
}

const DiaryList = ({ pageType, diaryData }: DiaryList) => {
  const { nickname } = diaryData[0];
  const pageTitle = pageType === HOME ? `${nickname} ${PAGE_TITLE_HOME}` : PAGE_TITLE_FEED;
  const content = diaryData.map((data: IDiaryContent, index) => (
    <DiaryListItem key={index} pageType={pageType} diaryItem={data} />
  ));

  return (
    <div className="w-3/5 p-5">
      <h1 className="mb-5 text-2xl font-bold">{pageTitle}</h1>
      {content}
    </div>
  );
};

export default DiaryList;
