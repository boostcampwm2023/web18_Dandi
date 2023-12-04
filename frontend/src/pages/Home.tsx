import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@api/Profile';
import { getDiaryDayList } from '@api/DiaryList';

import { InfiniteDiaryListProps } from '@type/components/Common/DiaryList';
import { viewTypes } from '@type/pages/MyDiary';

import NavBar from '@components/Common/NavBar';
import DiaryList from '@components/Common/DiaryList';
import Profile from '@components/Home/Profile';
import Grass from '@components/Home/Grass';
import EmotionStat from '@components/Home/EmotionStat';

import { HOME } from '@util/constants';

const Home = () => {
  const params = useParams();
  const userId = params.userId ? params.userId : localStorage.getItem('userId');

  const {
    data: profileData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['profileData', userId],
    queryFn: () => getCurrentUser(userId ? +userId : 0),
  });

  const { data: diaryData } = useInfiniteQuery<
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
            userId: localStorage.getItem('userId') as string,
            type: 'Day',
            lastIndex: lastPage?.diaryList.at(-1).diaryId,
          }
        : undefined;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  return (
    <main className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <Profile userId={userId ? +userId : 0} userData={profileData} />
      <Grass />
      <EmotionStat nickname={profileData.nickname} />
      {diaryData?.pages.map((page, index) => (
        <DiaryList
          key={index}
          pageType={HOME}
          diaryData={page.diaryList}
          username={page.nickname}
        />
      ))}
    </main>
  );
};

export default Home;
