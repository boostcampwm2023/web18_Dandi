import DiaryList from '../components/Common/DiaryList';
import NavBar from '../components/Common/NavBar';

const Home = () => {
  return (
    <main className="flex flex-col items-center">
      <NavBar />
      <DiaryList />
    </main>
  );
};

export default Home;
