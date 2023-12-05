import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import getEmotionStat from '@api/EmotionStat';

import { formatDateDash, calPrev } from '@util/funcs';
import { NEXT_INDEX, PREV_INDEX, PREV_WEEK } from '@/util/constants';

interface EmotionStatProps {
  nickname: string;
}

const EmotionStat = ({ nickname }: EmotionStatProps) => {
  const [period, setPeriod] = useState([calPrev(new Date(), PREV_WEEK), new Date()]);

  const { isError, isLoading } = useQuery({
    queryKey: ['emotionStat', localStorage.getItem('userId'), period],
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPeriod([new Date(e.target.value), period[1]])
            }
            max={formatDateDash(calPrev(period[1], PREV_INDEX))}
          />
          <p>~</p>
          <input
            type="date"
            className="border-brown rounded-xl border border-solid p-3 outline-none"
            defaultValue={formatDateDash(period[1])}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPeriod([period[0], new Date(e.target.value)])
            }
            min={formatDateDash(calPrev(period[0], NEXT_INDEX))}
            max={formatDateDash(new Date())}
          />
        </div>
      </div>
    </>
  );
};

export default EmotionStat;
