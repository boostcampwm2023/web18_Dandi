import DiaryList from '@components/Common/DiaryList';
import NavBar from '@components/Common/NavBar';
import Profile from '@components/Home/Profile';
import Grass from '@components/Home/Grass';
import { DUMMY_DATA } from '@/util/constants';

const Home = () => {
  return (
    <main className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <Profile
        nickname="윤주"
        isExistedTodayDiary={false}
        totalFriends={10}
        profileImage="https://i.namu.wiki/i/VMIHkLm6DcUT4d9-vN4yFw7Yfitr8luT_U2YwJsugGodCQ01ooGH_kHX0D6sJ3HDS1YHfvy9B81al8rKCxqKYw.webp"
      />
      <Grass />
      <DiaryList pageType="home" diaryData={DUMMY_DATA} />
    </main>
  );
};

export default Home;
