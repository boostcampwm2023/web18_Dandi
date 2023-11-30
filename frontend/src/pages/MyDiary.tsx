import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDiaryWeekAndMonthList } from '@api/DiaryList';

import { viewTypes } from '@type/pages/MyDiary';
import { IDiaryContent } from '@type/components/Common/DiaryList';

import NavBar from '@components/Common/NavBar';
import KeywordSearch from '@components/MyDiary/KeywordSearch';
import ViewType from '@components/MyDiary/ViewType';
import DiaryListItem from '@components/Common/DiaryListItem';
import DateController from '@components/MyDiary/DateController';
import Calendar from '@components/MyDiary/Calendar';
import Card from '@components/MyDiary/Card';
import CarouselContainer from '@components/MyDiary/CarouselContainer';

import { formatDateDash, getNowMonth, getNowWeek } from '@util/funcs';
import { formatDate } from '@util/funcs';
import { DIARY_VIEW_TYPE, DUMMY_DATA, WEEK_STANDARD_LENGTH } from '@util/constants';

const calPeriod = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  return [startDate, endDate];
};

const MyDiary = () => {
  const [viewType, setViewType] = useState<viewTypes>('Day');
  const [diaryData, _] = useState<IDiaryContent[]>(DUMMY_DATA);
  const [nowMonth, setNowMonth] = useState(new Date());
  const [nowWeek, setNowWeek] = useState(getNowWeek(new Date()));
  const [period, setPeriod] = useState(calPeriod());

  const { data, isError, isLoading } = useQuery<{ nickname: string; diaryList: IDiaryContent[] }>({
    queryKey: ['myWeekDiary', localStorage.getItem('userId')],
    queryFn: () =>
      getDiaryWeekAndMonthList({
        userId: localStorage.getItem('userId') as string,
        type: 'Week',
        startDate: formatDateDash(period[0]),
        endDate: formatDateDash(period[1]),
      }),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  const setPrevOrNextMonth = (plus: number) => {
    const month = new Date(nowMonth);
    month.setMonth(month.getMonth() + plus);
    setNowMonth(month);
  };

  const setPrevOrNextWeek = (plus: number) => {
    setPeriod(changePeriod(plus));
    setNowWeek(getNowWeek(period[1]));
  };

  const changePeriod = (plus: number) => {
    const [startDate, endDate] = period;
    startDate.setDate(startDate.getDate() + plus * 7);
    endDate.setDate(endDate.getDate() + plus * 7);
    return [startDate, endDate];
  };

  return (
    <>
      <NavBar />
      <main className="mx-auto mb-28 flex max-w-6xl flex-col items-center justify-start">
        <header className="my-10 flex w-full items-start justify-between">
          <KeywordSearch />
          <ViewType setViewType={setViewType} viewType={viewType} />
        </header>
        <section className="flex flex-col items-center">
          {viewType === DIARY_VIEW_TYPE.DAY &&
            diaryData.map((data, index) => <DiaryListItem diaryItem={data} key={index} />)}
          {viewType === DIARY_VIEW_TYPE.WEEK && (
            <>
              <DateController
                titles={[
                  `Week ${String(nowWeek).padStart(2, '0')}`,
                  `${formatDate(period[0])} ~ ${formatDate(period[1])}`,
                ]}
                leftOnClick={() => setPrevOrNextWeek(-1)}
                rightOnClick={() => setPrevOrNextWeek(1)}
              />
              {data && data.diaryList.length < WEEK_STANDARD_LENGTH && (
                <section className="flex gap-5">
                  {data.diaryList.map((diaryItem, index) => (
                    <Card data={diaryItem} key={index} />
                  ))}
                </section>
              )}
              {data && data.diaryList.length >= WEEK_STANDARD_LENGTH && (
                <CarouselContainer data={data.diaryList} />
              )}
            </>
          )}
          {viewType === DIARY_VIEW_TYPE.MONTH && (
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
