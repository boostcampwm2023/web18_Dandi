import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import getEmotionStat from '@api/EmotionStat';
import EmotionCloud from '@components/Home/EmotionCloud';

import { formatDateDash, calPrev } from '@util/funcs';
import { NEXT_INDEX, PREV_INDEX, PREV_WEEK } from '@util/constants';

interface EmotionStatProps {
  nickname: string;
}

interface emotionCloudProps {
  emotion: string;
  diaryInfo: diaryInfosProps[];
}

interface diaryInfosProps {
  diaryInfo: diaryInfoProps[];
}

interface diaryInfoProps {
  id: number;
  title: string;
  createdAt: Date;
}

const EmotionStat = ({ nickname }: EmotionStatProps) => {
  const params = useParams();
  const userId = params.userId ? params.userId : localStorage.getItem('userId');
  const [period, setPeriod] = useState([calPrev(new Date(), PREV_WEEK), new Date()]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['emotionStat', userId, period],
    queryFn: () =>
      getEmotionStat(Number(userId), formatDateDash(period[0]), formatDateDash(period[1])),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  const totalLength = (data?.emotions || []).reduce((acc: number, cur: emotionCloudProps) => {
    return (acc += cur.diaryInfo.length);
  }, 0);

  const eData = (data?.emotions || []).map((item: emotionCloudProps) => {
    return {
      text: item.emotion,
      size: (item.diaryInfo.length / totalLength) * 200,
    };
  });

  return (
    <div className="flex h-full w-3/5 flex-col gap-2 p-5">
      <div className="flex items-center justify-between p-5">
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
      <div className="border-brown h-full w-full grid-flow-col overflow-x-scroll rounded-lg border bg-white p-2">
        <EmotionCloud emotionData={eData} />
      </div>
    </div>
  );
};

export default EmotionStat;
