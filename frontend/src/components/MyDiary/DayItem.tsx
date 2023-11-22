interface DayItemProps {
  day: number;
  emotion?: string;
}

const DayItem = ({ day, emotion }: DayItemProps) => {
  return (
    <div className="flex flex-col p-3">
      <p className="text-xs">{day < 1 ? '' : day < 10 ? '0' + day : day}</p>
      <p className="my-2 text-center text-4xl">{emotion}</p>
    </div>
  );
};

export default DayItem;
