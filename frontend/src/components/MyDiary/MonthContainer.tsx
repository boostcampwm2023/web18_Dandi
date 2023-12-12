import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getDiaryWeekAndMonthList } from '@api/DiaryList';

import { IDiaryContent } from '@type/components/Common/DiaryList';
import { EmotionData } from '@type/components/MyDiary/MonthContainer';

import DateController from '@components/MyDiary/DateController';
import Calendar from '@components/MyDiary/Calendar';

import { NEXT_INDEX, PAGE_URL } from '@util/constants';
import { formatDateDash, getNowMonth } from '@util/funcs';

const MonthContainer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nowMonth, setNowMonth] = useState(new Date());
  const first = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
  const last = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + NEXT_INDEX, 0);

  const { data } = useQuery({
    queryKey: ['monthDiaryData', localStorage.getItem('userId'), formatDateDash(nowMonth)],
    queryFn: () =>
      getDiaryWeekAndMonthList({
        userId: localStorage.getItem('userId') as string,
        type: 'Month',
        startDate: formatDateDash(first),
        endDate: formatDateDash(last),
      }),
    select: (data) => {
      const emotionObject: EmotionData = {};
      data.diaryList.forEach((diary: IDiaryContent) => {
        const { diaryId, emotion, createdAt } = diary;
        const day = new Date(createdAt).getDate();
        emotionObject[day] = { diaryId: +diaryId, emotion: emotion };
      });
      return emotionObject;
    },
  });

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
