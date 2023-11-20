import NavBar from '@components/Common/NavBar';
import KeywordSearch from '../components/MyDiary/KeywordSearch';

const MyDiary = () => {
  return (
    <>
      <main className="mb-28 flex flex-col items-center">
        <NavBar />
        <header>
          <KeywordSearch />
        </header>
        <section>안녕</section>
      </main>
    </>
  );
};

export default MyDiary;
