import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import getEmotionStat from '@api/EmotionStat';
import EmotionCloud from '@components/Home/EmotionCloud';

import { formatDateDash, calPrev } from '@util/funcs';
import { DEBOUNCE_TIME, NEXT_INDEX, PAGE_URL, PREV_INDEX, PREV_WEEK } from '@util/constants';

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
  const navigate = useNavigate();
  const { state } = useLocation();

  const [period, setPeriod] = useState([
    state?.startDate || calPrev(new Date(), PREV_WEEK),
    state?.endDate || new Date(),
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state) {
        setPeriod([state?.startDate || period[0], state?.endDate || period[1]]);
      }
    }, DEBOUNCE_TIME * 2);
    return () => clearTimeout(timer);
  }, [state?.startDate, state?.endDate]);

  const { data, isError } = useQuery({
    queryKey: ['emotionStat', userId, formatDateDash(period[0]), formatDateDash(period[1])],
    queryFn: () =>
      getEmotionStat(Number(userId), formatDateDash(period[0]), formatDateDash(period[1])),
    staleTime: Infinity,
  });

  const navigatedURL = `${params.userId ? `/${params.userId}` : PAGE_URL.HOME}`;

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  const totalLength = (data?.emotions || []).reduce((acc: number, cur: emotionCloudProps) => {
    return (acc += cur.diaryInfo.length);
  }, 0);

  const eData = (data?.emotions || []).map((item: emotionCloudProps) => {
    return {
      text: item.emotion,
      size: (Math.log(item.diaryInfo.length + 1) / Math.log(totalLength + 1)) * 100,
    };
  });

  return (
    <div className="flex h-full w-full flex-col gap-2 p-5 sm:w-3/5">
      <div className="flex flex-col">
        <h3 className="mb-5 text-lg font-bold sm:text-2xl">
          최근 {nickname}님의 감정은 어땠을까요?
        </h3>
        <div className="mb-3 flex items-center gap-3">
          <label className="text-sm sm:text-base" htmlFor="startDate">
            시작일
          </label>
          <input
            className="border-brown rounded-xl border border-solid p-1 outline-none sm:p-3"
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={formatDateDash(period[0])}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              navigate(navigatedURL, {
                state: {
                  startDate: new Date(e.target.value),
                  endDate: period[1],
                },
              });
            }}
            max={formatDateDash(calPrev(period[1], PREV_INDEX))}
          />
          <p>~</p>
          <label className="text-sm sm:text-base" htmlFor="endDate">
            종료일
          </label>
          <input
            type="date"
            className="border-brown rounded-xl border border-solid p-1 outline-none sm:p-3"
            id="endDate"
            name="endDate"
            defaultValue={formatDateDash(period[1])}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              navigate(navigatedURL, {
                state: {
                  startDate: period[0],
                  endDate: new Date(e.target.value),
                },
              })
            }
            min={formatDateDash(calPrev(period[0], NEXT_INDEX))}
            max={formatDateDash(new Date())}
          />
        </div>
      </div>
      <div className="border-brown box-content h-56 grid-flow-col rounded-lg border bg-white p-2">
        <EmotionCloud emotionData={eData} />
      </div>
    </div>
  );
};

export default EmotionStat;
