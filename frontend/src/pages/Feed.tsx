import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeed } from '@api/Feed';

import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';

import NavBar from '@components/Common/NavBar';
import DiaryListItem from '@components/Common/DiaryListItem';

import { PAGE_TITLE_FEED } from '@util/constants';

const Feed = () => {
  const infiniteRef = useRef<HTMLDivElement>(null);

  const {
    data: feedData,
    isSuccess,
    fetchNextPage,
  } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null],
    { lastIndex: number }
  >({
    queryKey: ['feedDiaryList', localStorage.getItem('userId')],
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

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      });
    });
    if (infiniteRef.current) {
      io.observe(infiniteRef.current);
    }
  }, [isSuccess]);

  return (
    <div className="mb-28 flex w-full flex-col items-center justify-start">
      <NavBar />
      <div className="w-3/5 p-5">
        <h1 className="mb-5 text-2xl font-bold">{PAGE_TITLE_FEED}</h1>
        {feedData?.pages.map((page, pageIndex) =>
          page.diaryList.map((item, itemIndex) => (
            <DiaryListItem diaryItem={item} key={Number(String(pageIndex) + String(itemIndex))} />
          )),
        )}
      </div>
      <div ref={infiniteRef} />
    </div>
  );
};

export default Feed;
