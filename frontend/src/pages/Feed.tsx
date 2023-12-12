import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import disappointedFace from '@assets/image/disappointedFace.png';

import { getFeed } from '@api/Feed';

import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';

import NavBar from '@components/Common/NavBar';
import DiaryListItem from '@components/Common/DiaryListItem';

import { PAGE_TITLE_FEED, FEED } from '@util/constants';

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

  const isEmpty = !feedData?.pages[0].diaryList.length;

  return (
    <div className="mb-12 flex w-full flex-col items-center justify-start">
      <NavBar />
      <div className="w-full p-5 sm:w-3/5">
        <h1 className="mb-5 text-2xl font-bold">{PAGE_TITLE_FEED}</h1>
        {isEmpty && (
          <div className="mt-20 flex w-full flex-col items-center justify-center gap-5">
            <img className="w-1/5" src={disappointedFace} alt="피드가 없는 그림" />
            <p className="text-xl font-bold">아직 친구가 없어서 보여드릴 피드가 없어요.</p>
          </div>
        )}
        {feedData?.pages.map((page, pageIndex) =>
          page.diaryList.map((item, itemIndex) => (
            <DiaryListItem
              pageType={FEED}
              diaryItem={item}
              key={Number(String(pageIndex) + String(itemIndex))}
            />
          )),
        )}
      </div>
      <div ref={infiniteRef} />
    </div>
  );
};

export default Feed;
