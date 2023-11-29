import DiaryList from '@components/Common/DiaryList';
import NavBar from '@components/Common/NavBar';
import Profile from '@components/Home/Profile';
import Grass from '@components/Home/Grass';

import { DUMMY_DATA, HOME } from '@util/constants';
import { useParams } from 'react-router-dom';

const Home = () => {
  const params = useParams();
  const userId = params.userId ? params.userId : localStorage.getItem('userId');
  return (
    <main className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <Profile userId={Number(userId)} />
      <Grass />
      <DiaryList pageType={HOME} diaryData={DUMMY_DATA} />
    </main>
  );
};

export default Home;
