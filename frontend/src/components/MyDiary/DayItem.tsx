interface DayItemProps {
  day: number;
  emotion?: string;
}

const DayItem = ({ day, emotion }: DayItemProps) => {
  return (
    <div className="flex flex-col p-3">
      <p className="text-xs">{!day ? '' : String(day).padStart(2, '0')}</p>
      <p className="my-2 text-center text-4xl">{emotion}</p>
    </div>
  );
};

export default DayItem;
