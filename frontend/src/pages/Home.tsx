import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@api/Profile';
import { getDiaryDayList } from '@api/DiaryList';
import dizzyFace from '@assets/image/dizzyFace.png';

import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';
import { viewTypes } from '@type/pages/MyDiary';

import NavBar from '@components/Common/NavBar';
import DiaryListItem from '@components/Common/DiaryListItem';
import Profile from '@components/Home/Profile';
import Grass from '@components/Home/Grass';
import EmotionStat from '@components/Home/EmotionStat';

import { PAGE_TITLE_HOME } from '@util/constants';

const Home = () => {
  const params = useParams();
  const userId = params.userId ? params.userId : localStorage.getItem('userId');
  const infiniteRef = useRef<HTMLDivElement>(null);

  const {
    data: profileData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['profileData', userId],
    queryFn: () => getCurrentUser(userId ? +userId : 0),
  });

  const {
    data: diaryData,
    fetchNextPage,
    isSuccess,
  } = useInfiniteQuery<
    any,
    Error,
    InfiniteDiaryListProps,
    [string, string | null],
    { userId: string; type: viewTypes; lastIndex: number }
  >({
    queryKey: ['dayDiaryList', userId],
    queryFn: getDiaryDayList,
    initialPageParam: {
      userId: userId as string,
      type: 'Day',
      lastIndex: 2e9,
    },
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.diaryList.length >= 5
        ? {
            userId: userId as string,
            type: 'Day',
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
    enabled: !!userId,
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  const isEmpty = !diaryData?.pages[0].diaryList.length;

  return (
    <main className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <Profile userId={userId ? +userId : 0} userData={profileData} />
      <Grass />
      <EmotionStat nickname={profileData.nickname} />

      <div className="w-full p-5 sm:w-3/5">
        <h1 className="mb-5 text-lg font-bold sm:text-2xl">{`${profileData.nickname}${PAGE_TITLE_HOME}`}</h1>
        {isEmpty && (
          <div className="mt-20 flex w-full flex-col items-center justify-center gap-3">
            <img className="w-1/3" src={dizzyFace} alt="작성한 일기가 없는 그림" />
            <p className="text-xl font-bold">작성한 일기가 없어요.</p>
          </div>
        )}
        {diaryData?.pages.map((page, pageIndex) =>
          page.diaryList.map((item, itemIndex) => (
            <DiaryListItem diaryItem={item} key={Number(String(pageIndex) + String(itemIndex))} />
          )),
        )}
      </div>
      <div ref={infiniteRef} />
    </main>
  );
};

export default Home;
