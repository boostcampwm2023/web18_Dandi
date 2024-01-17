import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeed } from '@api/Feed';
import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';
import { reactQueryKeys } from '@util/constants';

const useFeedDiaryList = (userId: string) => {
  return useInfiniteQuery<
  any,
  Error,
  InfiniteDiaryListProps,
  [string, string | null],
  { lastIndex: number }
>({
  queryKey: [reactQueryKeys.FeedDiaryList, userId],
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
};

export default useFeedDiaryList;
