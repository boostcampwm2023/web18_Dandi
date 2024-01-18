import { useInfiniteQuery } from '@tanstack/react-query';

import { getSearchResults } from '@api/KeywordSearch';

import { searchOptionsType } from '@type/pages/MyDiary';
import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';

import { reactQueryKeys } from '@util/constants';

const useSearchDataListQuery = (
  keyword: string,
  selected: searchOptionsType,
  searchFlag: boolean,
) => {
  return useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null, searchOptionsType],
    { keyword: string; lastIndex: number; type: searchOptionsType }
  >({
    queryKey: [reactQueryKeys.SearchDataList, keyword, selected],
    queryFn: getSearchResults,
    initialPageParam: {
      keyword: keyword,
      type: selected,
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            keyword: keyword,
            type: selected,
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
    enabled: searchFlag && !!keyword,
  });
};

export default useSearchDataListQuery;
