import NavBar from '@components/Common/NavBar';
import KeywordSearch from '@components/MyDiary/KeywordSearch';
import ViewType from '@components/MyDiary/ViewType';
import { useEffect, useState } from 'react';
import DiaryListItem from '@components/Common/DiaryListItem';
import { IDiaryContent } from '../types/components/Common/DiaryList';
import { viewTypes } from '../types/pages/MyDiary';
import DateController from '../components/MyDiary/DateController';
import { getNowMonth } from '../util/MyDiary';
import Calendar from '../components/MyDiary/Calendar';
import { dummyData } from '../util/dummyData';

const MyDiary = () => {
  const [viewType, setViewType] = useState<viewTypes>('Day');
  const [diaryData, setDiaryData] = useState<IDiaryContent[]>(dummyData);
  const [nowMonth, setNowMonth] = useState(new Date());

  const setPrevOrNextMonth = (plus: number) => {
    const month = new Date(nowMonth);
    month.setMonth(month.getMonth() + plus);
    setNowMonth(month);
  };

  useEffect(() => setDiaryData(dummyData), []);

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
            diaryData.map((data, index) => <DiaryListItem diaryItem={data} key={index} />)}
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
