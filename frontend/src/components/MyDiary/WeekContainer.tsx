import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDiaryWeekAndMonthList } from '@api/DiaryList';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Card from '@components/MyDiary/Card';
import CarouselContainer from '@components/MyDiary/CarouselContainer';
import DateController from '@components/MyDiary/DateController';

import { WEEK_STANDARD_LENGTH } from '@util/constants';
import { getNowWeek, formatDate, formatDateDash } from '@util/funcs';

const calPeriod = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  return [startDate, endDate];
};

const WeekContainer = () => {
  const [nowWeek, setNowWeek] = useState(getNowWeek(new Date()));
  const [period, setPeriod] = useState(calPeriod());

  const { data } = useQuery<{ nickname: string; diaryList: IDiaryContent[] }>({
    queryKey: ['myWeekDiary', localStorage.getItem('userId'), period[0], period[1]],
    queryFn: () =>
      getDiaryWeekAndMonthList({
        userId: localStorage.getItem('userId') as string,
        type: 'Week',
        startDate: formatDateDash(period[0]),
        endDate: formatDateDash(period[1]),
      }),
  });

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
    <section className="flex w-full max-w-6xl flex-col items-center">
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
            <Card diaryItem={diaryItem} key={index} />
          ))}
        </section>
      )}
      {data && data.diaryList.length >= WEEK_STANDARD_LENGTH && (
        <CarouselContainer data={data.diaryList} />
      )}
    </section>
  );
};

export default WeekContainer;
