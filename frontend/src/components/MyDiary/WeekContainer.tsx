import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDiaryWeekAndMonthList } from '@api/DiaryList';
import dizzyFace from '@assets/image/dizzyFace.png';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import CarouselContainer from '@components/MyDiary/CarouselContainer';
import DateController from '@components/MyDiary/DateController';

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
      {data && Boolean(data.diaryList.length) == true && (
        <CarouselContainer data={data.diaryList} />
      )}
      {data && !data.diaryList.length && (
        <div className="mt-20 flex w-full flex-col items-center justify-center gap-3">
          <img className="w-1/6" src={dizzyFace} alt="작성한 일기가 없는 그림" />
          <p className="text-xl font-bold">작성한 일기가 없어요.</p>
        </div>
      )}
    </section>
  );
};

export default WeekContainer;
