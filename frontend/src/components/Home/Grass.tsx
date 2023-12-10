import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import getGrass from '@api/Grass';

import GrassTooltip from '@components/Home/GrassTooltip';

import { EMOTION_LEVELS } from '@util/constants';

interface GrassDataProps {
  date: string;
  mood: number;
}

const Grass = () => {
  const params = useParams();
  const userId = params.userId || localStorage.getItem('userId');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  });

  const currentDate: Date = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const lastYear: Date = new Date(currentDate);
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  const dates = Array.from({ length: 366 }, () => 0);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['grass', userId],
    queryFn: () => getGrass(Number(userId)),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  data.yearMood.forEach(({ date, mood }: GrassDataProps) => {
    const dataDate = new Date(date);
    const index = Math.floor((dataDate.getTime() - lastYear.getTime()) / (24 * 60 * 60 * 1000));
    dates[index] = mood;
  });
  const grassData = [...Array(lastYear.getDay()).fill(undefined), ...dates];
  const getTooltipContent = (index: number) => {
    const tmpDate = new Date(lastYear);
    tmpDate.setDate(tmpDate.getDate() - lastYear.getDay() + index);
    const moodContent = EMOTION_LEVELS[grassData[index]];
    return `${moodContent} mood on ${tmpDate.toLocaleDateString()}`;
  };

  const grassElements = grassData.map((mood, index) => {
    if (mood === undefined) {
      return <div key={index} className={`m-[0.1rem] h-4 w-4`}></div>;
    }

    return (
      <GrassTooltip key={index} content={getTooltipContent(index)}>
        <div className={`m-[0.1rem] h-4 w-4 rounded bg-emotion-${mood}`}></div>
      </GrassTooltip>
    );
  });

  return (
    <div className="flex h-full  w-full flex-col gap-2 p-5 sm:w-3/5">
      <p className="text-lg font-bold sm:text-2xl">
        지난 1년간 {data.yearMood.length}개의 일기를 작성하셨어요.
      </p>
      <div
        ref={containerRef}
        className="grid-rows-7 border-brown grid h-full w-full grid-flow-col overflow-x-scroll rounded-lg border p-2"
      >
        {grassElements}
      </div>
    </div>
  );
};

export default Grass;
