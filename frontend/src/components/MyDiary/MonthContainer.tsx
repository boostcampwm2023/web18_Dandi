import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DateController from '@components/MyDiary/DateController';
import Calendar from '@components/MyDiary/Calendar';

import useMonthDiaryDataQuery from '@hooks/useMonthDiaryDataQuery';

import { NEXT_INDEX, PAGE_URL } from '@util/constants';
import { getNowMonth } from '@util/funcs';

const MonthContainer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nowMonth, setNowMonth] = useState(new Date());
  const userId = localStorage.getItem('userId') as string;
  const first = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
  const last = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + NEXT_INDEX, 0);

  const { data } = useMonthDiaryDataQuery(userId, nowMonth, first, last);

  const setPrevOrNextMonth = (plus: number) => {
    const month = new Date(nowMonth);
    month.setMonth(month.getMonth() + plus);
    navigate(`${PAGE_URL.MY_DIARY}`, {
      state: {
        viewType: state?.viewType,
        month: month,
      },
    });
  };

  useEffect(() => {
    if (state?.month) {
      setNowMonth(new Date(state?.month));
    } else {
      setNowMonth(new Date());
    }
  }, [state?.month]);

  return (
    <>
      <DateController
        titles={[getNowMonth(nowMonth).join(' '), String(nowMonth.getFullYear())]}
        leftOnClick={() => setPrevOrNextMonth(-1)}
        rightOnClick={() => setPrevOrNextMonth(1)}
      />
      <Calendar first={first} last={last} emotionData={data} />
    </>
  );
};

export default MonthContainer;
