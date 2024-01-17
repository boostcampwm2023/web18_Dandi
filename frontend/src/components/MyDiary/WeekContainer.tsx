import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dizzyFace from '@assets/image/dizzyFace.png';

import CarouselContainer from '@components/MyDiary/CarouselContainer';
import DateController from '@components/MyDiary/DateController';
import useMyWeekDiaryQuery from '@hooks/useMyWeekDiaryQuery';
import { getNowWeek, formatDate } from '@util/funcs';
import { PAGE_URL } from '@util/constants';

const calPeriod = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  return [startDate, endDate];
};

const WeekContainer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nowWeek, setNowWeek] = useState(getNowWeek(new Date()));
  const [period, setPeriod] = useState(calPeriod());

  const userId = localStorage.getItem('userId') as string;

  const { data } = useMyWeekDiaryQuery(userId, period);

  const setPrevOrNextWeek = (plus: number) => {
    const [newStartDate, newEndDate] = changePeriod(plus);
    setNowWeek(getNowWeek(newEndDate));
    navigate(`${PAGE_URL.MY_DIARY}`, {
      state: {
        viewType: state?.viewType,
        startDate: newStartDate,
        endDate: newEndDate,
      },
    });
  };

  const changePeriod = (plus: number) => {
    const [startDate, endDate] = period;
    startDate.setDate(startDate.getDate() + plus * 7);
    endDate.setDate(endDate.getDate() + plus * 7);
    return [startDate, endDate];
  };

  useEffect(() => {
    if (state?.startDate && state?.endDate) {
      setPeriod([new Date(state?.startDate), new Date(state?.endDate)]);
      setNowWeek(getNowWeek(state?.endDate));
    } else {
      setPeriod(calPeriod());
    }
  }, [state?.startDate, state?.endDate]);

  return (
    <section className="relative flex w-full max-w-6xl flex-col items-center">
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
