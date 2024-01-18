import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import dizzyFace from '@assets/image/dizzyFace.png';

import NavBar from '@components/Common/NavBar';
import Loading from '@components/Common/Loading';
import DiaryListItem from '@components/Common/DiaryListItem';
import Modal from '@components/Common/Modal';
import Profile from '@components/Home/Profile';
import Grass from '@components/Home/Grass';
import EmotionStat from '@components/Home/EmotionStat';

import useModal from '@hooks/useModal';
import useProfileDataQuery from '@hooks/useProfileDataQuery';
import useDayDiaryListQuery from '@hooks/useDayDiaryListQuery';

import { PAGE_TITLE_HOME, PAGE_URL } from '@util/constants';

const Home = () => {
  const params = useParams();
  const userId = params.userId || (localStorage.getItem('userId') as string);
  const infiniteRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { closeModal } = useModal();
  useEffect(() => {
    closeModal();
  }, [userId]);

  const { data: profileData, isError, isLoading: profileDataLoading } = useProfileDataQuery(userId);

  const {
    data: diaryData,
    fetchNextPage,
    isLoading: diaryDataLoading,
    isSuccess,
  } = useDayDiaryListQuery(userId);

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
    return () => io.disconnect();
  }, [isSuccess]);

  if (profileDataLoading || diaryDataLoading) {
    return <Loading phrase="로딩 중이에요." />;
  }

  if (isError) {
    navigate(`${PAGE_URL.NOT_FOUND}`);
  }

  const isEmpty = !diaryData?.pages[0].diaryList.length;

  return (
    <>
      <main className="mb-12 flex flex-col items-center justify-start">
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
      <Modal />
    </>
  );
};

export default Home;
