import NavBar from '@components/Common/NavBar';
import KeywordSearch from '@components/MyDiary/KeywordSearch';
import ViewType from '@components/MyDiary/ViewType';
import { useState } from 'react';
import DiaryListItem from '@components/Common/DiaryListItem';
import { IDiaryContent } from '../types/components/Common/DiaryList';
import { viewTypes } from '../types/pages/MyDiary';
import DateController from '../components/MyDiary/DateController';
import { getNowMonth } from '../util/MyDiary';
import Calendar from '../components/MyDiary/Calendar';

const dummyData = [
  {
    createdAt: '2023-11-13T13:50:17.106Z',
    profileImage: '',
    nickname: '단디',
    thumbnail:
      'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
    title: '시고르자브종',
    content: `일기내용입니다.\n일기내용입니다.\n세 번째 줄까지만 보입니다다다다다다다다다다다다다다다다다다다다\n4줄부터 안보입니다!!\n`,
    keywords: ['키워드1', '키워드2', '키워드3', '키워드4'],
    reactionCount: 10,
    pageType: '',
    authorId: 1,
    diaryId: 1,
  },
];

const MyDiary = () => {
  const [viewType, setViewType] = useState<viewTypes>('Day');
  const [diaryData, setDiaryData] = useState<IDiaryContent[]>(dummyData);
  const [nowMonth, setNowMonth] = useState(new Date());
  const [nowWeek, setNowWeek] = useState();

  const setPrevOrNextMonth = (plus: number) => {
    const month = new Date(nowMonth);
    month.setMonth(month.getMonth() + plus);
    setNowMonth(month);
  };

  return (
    <>
      <NavBar />
      <main className="mx-auto mb-28 flex max-w-5xl flex-col items-center justify-start">
        <header className="my-10 flex w-full justify-between">
          <KeywordSearch />
          <ViewType setViewType={setViewType} viewType={viewType} />
        </header>
        <section className="flex flex-col items-center">
          {viewType === 'Day' &&
            diaryData.map((data, index) => <DiaryListItem {...data} key={index} pageType="" />)}
          {viewType === 'Month' && (
            <>
              <DateController
                titles={[getNowMonth(nowMonth).join(' '), String(nowMonth.getFullYear())]}
                leftOnClick={() => setPrevOrNextMonth(-1)}
                rightOnClick={() => setPrevOrNextMonth(1)}
              />
              <Calendar date={nowMonth} />
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default MyDiary;
