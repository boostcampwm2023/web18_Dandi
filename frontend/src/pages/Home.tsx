import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@api/Profile';

import DiaryList from '@components/Common/DiaryList';
import NavBar from '@components/Common/NavBar';
import Profile from '@components/Home/Profile';
import Grass from '@components/Home/Grass';
import EmotionStat from '@components/Home/EmotionStat';

import { DUMMY_DATA, HOME } from '@util/constants';

const Home = () => {
  const params = useParams();
  const userId = params.userId ? params.userId : localStorage.getItem('userId');

  if (!userId) {
    return alert('로그인하세요');
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['profileData', userId],
    queryFn: () => getCurrentUser(+userId),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  // TODO: 무한스크롤 => 데이터 빈 객체로 오는 것 백엔드와 함께 해결

  return (
    <main className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <Profile userId={+userId} userData={data} />
      <Grass />
      <EmotionStat nickname={data.nickname} />
      <DiaryList pageType={HOME} diaryData={DUMMY_DATA} />
    </main>
  );
};

export default Home;
