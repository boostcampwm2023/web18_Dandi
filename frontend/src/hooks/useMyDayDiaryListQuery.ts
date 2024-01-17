import { useInfiniteQuery } from '@tanstack/react-query';

import { getDiaryDayList } from '@api/DiaryList';
import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';
import { viewTypes } from '@type/pages/MyDiary';
import { reactQueryKeys, DIARY_VIEW_TYPE_LIST } from '@util/constants';

const useMyDayDiaryListQuery = (userId: string) => {
  return useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null],
    { userId: string; type: viewTypes; lastIndex: number }
  >({
    queryKey: [reactQueryKeys.MyDayDiaryList, userId],

    queryFn: getDiaryDayList,
    initialPageParam: {
      userId: userId,
      type: DIARY_VIEW_TYPE_LIST[0],
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            userId: userId,
            type: DIARY_VIEW_TYPE_LIST[0],
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
  });
};

export default useMyDayDiaryListQuery;
