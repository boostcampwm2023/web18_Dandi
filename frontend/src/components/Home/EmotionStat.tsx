import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import getEmotionStat from '@api/EmotionStat';

import { formatDateDash } from '@util/funcs';

interface EmotionStatProps {
  nickname: string;
}

const calPrevOneWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

const EmotionStat = ({ nickname }: EmotionStatProps) => {
  const [period, _] = useState([calPrevOneWeek(), new Date()]);

  const { isError, isLoading } = useQuery({
    queryKey: ['emotionStat', localStorage.getItem('userId')],
    queryFn: () =>
      getEmotionStat(
        Number(localStorage.getItem('userId')),
        formatDateDash(period[0]),
        formatDateDash(period[1]),
      ),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  return (
    <>
      <div className="flex w-3/5 items-center justify-between p-5">
        <h3 className="text-2xl font-bold">최근 {nickname}님의 감정은 어땠을까요?</h3>
        <div className="flex items-center gap-3">
          <input
            className="border-brown rounded-xl border border-solid p-3 outline-none"
            type="date"
            defaultValue={formatDateDash(period[0])}
          />
          <p>~</p>
          <input
            type="date"
            className="border-brown rounded-xl border border-solid p-3 outline-none"
            defaultValue={formatDateDash(period[1])}
          />
        </div>
      </div>
    </>
  );
};

export default EmotionStat;
