interface GrassDataProps {
  date: string;
  mood: string;
}

const Grass = () => {
  const data = [
    { date: '2023-01-13', mood: 'soso' },
    { date: '2023-01-13', mood: 'bad' },
    { date: '2023-01-31', mood: 'bad' },
    { date: '2023-02-07', mood: 'excellent' },
    { date: '2023-03-23', mood: 'bad' },
    { date: '2023-04-12', mood: 'soso' },
    { date: '2023-04-28', mood: 'soso' },
    { date: '2023-05-23', mood: 'good' },
    { date: '2023-06-13', mood: 'bad' },
    { date: '2023-06-24', mood: 'bad' },
    { date: '2023-06-29', mood: 'good' },
    { date: '2023-07-16', mood: 'bad' },
    { date: '2023-07-29', mood: 'excellent' },
    { date: '2023-08-15', mood: 'excellent' },
    { date: '2023-08-18', mood: 'terrible' },
    { date: '2023-08-29', mood: 'soso' },
    { date: '2023-09-16', mood: 'bad' },
    { date: '2023-09-16', mood: 'excellent' },
    { date: '2023-09-17', mood: 'soso' },
    { date: '2023-10-15', mood: 'good' },
  ];

  const currentDate: Date = new Date();
  const lastYear: Date = new Date(currentDate);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const dates: (string | null)[] = new Array(365).fill(null);
  data.forEach(({ date, mood }: GrassDataProps) => {
    const dataDate: Date = new Date(date);
    const index: number = Math.floor(
      (dataDate.getTime() - lastYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    dates[index] = mood;
  });
  const grassData = [...Array(lastYear.getDay()).fill(undefined), ...dates];
  const renderGrass = () => {
    return grassData.map((mood, index) => (
      <div key={index} className={`m-[0.1rem] h-4 w-4 rounded bg-emotion-${mood}`}></div>
    ));
  };

  return (
    <div className="flex w-3/5 flex-col gap-2 p-5 ">
      <p className="text-2xl font-bold">지난 1년간 {data.length}개의 일기를 작성하셨어요.</p>
      <div className="overflow-x-scroll grid-rows-7 border-brown grid grid-flow-col rounded-lg border p-2">
        {renderGrass()}
      </div>
    </div>
  );
};

export default Grass;
