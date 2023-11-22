import { useRef, useEffect, useState } from 'react';
import { EMOTION_LEVELS, dummyData } from '@/util/Grass';
import GrassTooltip from '@components/Home/GrassTooltip';

interface GrassDataProps {
  date: string;
  mood: number;
}

const Grass = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const currentDate: Date = new Date();
  const lastYear: Date = new Date(currentDate);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const dates: number[] = new Array(365).fill(0);
  dummyData.forEach(({ date, mood }: GrassDataProps) => {
    const dataDate: Date = new Date(date);
    const index: number = Math.floor(
      (dataDate.getTime() - lastYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    dates[index] = mood;
  });
  const grassData = [...Array(lastYear.getDay()).fill(undefined), ...dates];

  const getTooltipContent = (index: number) => {
    const tmpDate = new Date(lastYear);
    tmpDate.setDate(tmpDate.getDate() + index);
    const moodContent = EMOTION_LEVELS[grassData[index]];
    return `${moodContent} mood on ${tmpDate.toLocaleDateString()}`;
  };

  const renderGrass = (scrollLeft: number) => {
    return grassData.map((mood, index) => {
      return (
        <GrassTooltip key={index} scrollLeft={scrollLeft} content={getTooltipContent(index)}>
          <div className={`m-[0.1rem] h-4 w-4 rounded bg-emotion-${mood}`}></div>
        </GrassTooltip>
      );
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollLeft(scrollRef.current.scrollLeft);
      }
    };
    scrollRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      scrollRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex h-full w-3/5 flex-col gap-2 p-5">
      <p className="text-2xl font-bold">지난 1년간 {dummyData.length}개의 일기를 작성하셨어요.</p>
      <div
        ref={scrollRef}
        className="grid-rows-7 border-brown grid h-full w-full grid-flow-col overflow-x-scroll rounded-lg border p-2"
      >
        {renderGrass(scrollRef.current?.scrollLeft || 0)}
      </div>
    </div>
  );
};

export default Grass;
