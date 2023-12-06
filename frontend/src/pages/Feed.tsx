import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeed } from '@api/Feed';

import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';

import NavBar from '@components/Common/NavBar';
import DiaryList from '@components/Common/DiaryList';

import { DUMMY_DATA, FEED } from '@util/constants';

const Feed = () => {
  const { data: feedData } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null],
    { lastIndex: number }
  >({
    queryKey: ['dayDiaryList', localStorage.getItem('userId')],
    queryFn: getFeed,
    initialPageParam: {
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
  });
  return (
    <div className="mb-28 flex w-full flex-col items-center justify-start">
      <NavBar />
      {feedData?.pages.map((page, index) => (
        <DiaryList key={index} pageType={FEED} diaryData={DUMMY_DATA} username={'yoonju'} />
      ))}
    </div>
  );
};

export default Feed;
