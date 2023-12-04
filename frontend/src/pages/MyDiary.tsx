import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getDiaryDayList } from '@api/DiaryList';

import { viewTypes } from '@type/pages/MyDiary';
import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';

import NavBar from '@components/Common/NavBar';
import DiaryListItem from '@components/Common/DiaryListItem';
import KeywordSearch from '@components/MyDiary/KeywordSearch';
import WeekContainer from '@components/MyDiary/WeekContainer';
import ViewType from '@components/MyDiary/ViewType';
import MonthContainer from '@components/MyDiary/MonthContainer';

import { DIARY_VIEW_TYPE } from '@util/constants';

const MyDiary = () => {
  const [viewType, setViewType] = useState<viewTypes>('Day');

  const { data } = useInfiniteQuery<any, Error, InfiniteDiaryListProps, [string, string | null]>({
    queryKey: ['dayDiaryList', localStorage.getItem('userId')],
    queryFn: getDiaryDayList,
    initialPageParam: {
      userId: localStorage.getItem('userId') as string,
      type: 'Day',
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            userId: localStorage.getItem('userId') as string,
            type: 'Day',
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
  });

  return (
    <>
      <NavBar />
      <main className="mx-auto mb-28 flex max-w-6xl flex-col items-center justify-start">
        <header className="my-10 flex w-full items-start justify-between">
          <KeywordSearch />
          <ViewType setViewType={setViewType} viewType={viewType} />
        </header>
        <section className="flex flex-col items-center">
          {viewType === DIARY_VIEW_TYPE.DAY &&
            data?.pages.map((page) =>
              page.diaryList.map((item, index) => <DiaryListItem key={index} diaryItem={item} />),
            )}
          {viewType === DIARY_VIEW_TYPE.WEEK && <WeekContainer />}
          {viewType === DIARY_VIEW_TYPE.MONTH && <MonthContainer />}
        </section>
      </main>
    </>
  );
};

export default MyDiary;
