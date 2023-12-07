import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getDiaryDayList } from '@api/DiaryList';
import { getSearchResults } from '@api/KeywordSearch';
import dizzyFace from '@assets/image/dizzyFace.png';

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
  const [keyword, setKeyword] = useState<string>('');
  const [searchFlag, setSearchFlag] = useState(false);
  const [selected, setSelected] = useState<searchOptionsType>('키워드');
  const infiniteRef = useRef<HTMLDivElement>(null);

  const {
    data: diaryData,
    isSuccess: diaryDataSuccess,
    fetchNextPage: fetchNextDiaryPage,
  } = useInfiniteQuery<
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

  const {
    data: searchData,
    isSuccess: searchDataSuccess,
    fetchNextPage: fetchNextSearchPage,
  } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null, searchOptionsType],
    { keyword: string; lastIndex: number; type: searchOptionsType }
  >({
    queryKey: ['searchDataList', keyword, selected],
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

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (searchFlag) {
            fetchNextSearchPage();
          } else {
            fetchNextDiaryPage();
          }
        }
      });
    });
    if (infiniteRef.current) {
      io.observe(infiniteRef.current);
    }
  }, [diaryDataSuccess, searchDataSuccess]);

  const isEmpty = !diaryData?.pages[0].diaryList.length;

  return (
    <>
      <NavBar />
      <main className="mx-auto mb-28 flex w-full flex-col items-center justify-start">
        <header className="my-10 flex w-full max-w-6xl items-start justify-between">
          <KeywordSearch
            keyword={keyword}
            selected={selected}
            searchFlag={searchFlag}
            setKeyword={setKeyword}
            setSelected={setSelected}
            setSearchFlag={setSearchFlag}
          />
          <ViewType setViewType={setViewType} viewType={viewType} />
        </header>
        <section className="flex w-3/5 flex-col items-center">
          {isEmpty && viewType === DIARY_VIEW_TYPE.DAY && (
            <div className="mt-20 flex w-full flex-col items-center justify-center gap-3">
              <img className="w-1/3" src={dizzyFace} alt="작성한 일기가 없는 그림" />
              <p className="text-xl font-bold">작성한 일기가 없어요.</p>
            </div>
          )}

          {viewType === DIARY_VIEW_TYPE.DAY && !keyword && (
            <div className="w-full p-5">
              {diaryData?.pages.map((page, pageIndex) =>
                page.diaryList.map((item, itemIndex) => (
                  <DiaryListItem diaryItem={item} key={pageIndex + itemIndex} />
                )),
              )}
            </div>
          )}
          {viewType === DIARY_VIEW_TYPE.DAY && keyword && (
            <div className="w-full p-5">
              {searchData?.pages.map((page, pageIndex) =>
                page.diaryList.map((item, itemIndex) => (
                  <DiaryListItem diaryItem={item} key={pageIndex + itemIndex} />
                )),
              )}
            </div>
          )}
          <div ref={infiniteRef} />
        </section>
        {viewType === DIARY_VIEW_TYPE.WEEK && <WeekContainer />}
        {viewType === DIARY_VIEW_TYPE.MONTH && <MonthContainer />}
      </main>
    </>
  );
};

export default MyDiary;
