import GrassTooltip from '@components/Home/GrassTooltip';

import { EMOTION_LEVELS, DUMMY_DATA } from '@util/Grass';

interface GrassDataProps {
  date: string;
  mood: number;
}

const Grass = () => {
  const currentDate: Date = new Date();
  const lastYear: Date = new Date(currentDate);
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  const dates = Array.from({ length: 366 }, () => 0);
  DUMMY_DATA.forEach(({ date, mood }: GrassDataProps) => {
    const dataDate = new Date(date);
    const index = Math.floor((dataDate.getTime() - lastYear.getTime()) / (24 * 60 * 60 * 1000));
    dates[index] = mood;
  });
  const grassData = [...Array(lastYear.getDay()).fill(undefined), ...dates];

  const getTooltipContent = (index: number) => {
    const tmpDate = new Date(lastYear);
    tmpDate.setDate(tmpDate.getDate() + index);
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
    <div className="flex h-full w-3/5 flex-col gap-2 p-5">
      <p className="text-2xl font-bold">지난 1년간 {DUMMY_DATA.length}개의 일기를 작성하셨어요.</p>
      <div className="grid-rows-7 border-brown grid h-full w-full grid-flow-col overflow-x-scroll rounded-lg border p-2">
        {grassElements}
      </div>
    </div>
  );
};

export default Grass;
