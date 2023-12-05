import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getDiaryDayList } from '@api/DiaryList';
import { getContentSearchResults, getKeywordSearchResults } from '@api/KeywordSearch';

import { viewTypes, searchOptionsType } from '@type/pages/MyDiary';
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
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [contentSearchItem, setContentSearchItem] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);
  const [selected, setSelected] = useState<searchOptionsType>('키워드');

  useEffect(() => {
    if (!keywordList.length) {
      setSearchFlag(false);
    }
  }, [keywordList]);

  const { data: diaryData } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null],
    { userId: string; type: viewTypes; lastIndex: number }
  >({
    queryKey: ['myDayDiaryList', localStorage.getItem('userId')],

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

  const { data: keywordSearchData } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string[] | null],
    { keywordList: string[]; lastIndex: number }
  >({
    queryKey: ['keywordSearchDataList', keywordList],
    queryFn: getKeywordSearchResults,
    initialPageParam: {
      keywordList: keywordList,
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            keywordList: keywordList,
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
    enabled: !!searchFlag && !!keywordList.length,
  });

  const { data: contentSearchData } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null],
    { contentSearchItem: string; lastIndex: number }
  >({
    queryKey: ['contentSearchDataList', contentSearchItem],
    queryFn: getContentSearchResults,
    initialPageParam: {
      contentSearchItem: contentSearchItem,
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            contentSearchItem: contentSearchItem,
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
    enabled: !!searchFlag && !!contentSearchItem,
  });

  return (
    <>
      <NavBar />
      <main className="mx-auto mb-28 flex max-w-6xl flex-col items-center justify-start">
        <header className="my-10 flex w-full items-start justify-between">
          <KeywordSearch
            keywordList={keywordList}
            selected={selected}
            setKeywordList={setKeywordList}
            setSelected={setSelected}
            setSearchFlag={setSearchFlag}
            setContentSearchItem={setContentSearchItem}
          />
          <ViewType setViewType={setViewType} viewType={viewType} />
        </header>
        <section className="mt-10 flex flex-col items-center">
          {viewType === DIARY_VIEW_TYPE.DAY &&
            !searchFlag &&
            diaryData?.pages.map((page, pageIndex) =>
              page.diaryList.map((item, itemIndex) => (
                <DiaryListItem diaryItem={item} key={pageIndex + itemIndex} />
              )),
            )}
          {viewType === DIARY_VIEW_TYPE.DAY &&
            searchFlag &&
            keywordList &&
            selected === '키워드' &&
            keywordSearchData?.pages.map((page, pageIndex) =>
              page.diaryList.map((item, itemIndex) => (
                <DiaryListItem diaryItem={item} key={pageIndex + itemIndex} />
              )),
            )}
          {viewType === DIARY_VIEW_TYPE.DAY &&
            contentSearchItem &&
            searchFlag &&
            selected === '제목 + 내용' &&
            contentSearchData?.pages.map((page, pageIndex) =>
              page.diaryList.map((item, itemIndex) => (
                <DiaryListItem diaryItem={item} key={pageIndex + itemIndex} />
              )),
            )}
          {viewType === DIARY_VIEW_TYPE.WEEK && <WeekContainer />}
          {viewType === DIARY_VIEW_TYPE.MONTH && <MonthContainer />}
        </section>
      </main>
    </>
  );
};

export default MyDiary;
