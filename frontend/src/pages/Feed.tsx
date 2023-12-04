import NavBar from '@components/Common/NavBar';
import DiaryList from '@components/Common/DiaryList';

import { DUMMY_DATA, FEED } from '@util/constants';

import { useInfiniteQuery } from '@tanstack/react-query';
import { InfiniteDiaryListProps } from '@/types/components/Common/DiaryList';
import { getFeed } from '@/api/Feed';

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
    <div className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <DiaryList pageType={FEED} diaryData={DUMMY_DATA} />
    </div>
  );
};

export default Feed;
