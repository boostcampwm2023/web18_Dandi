interface DayItemProps {
  day: number;
  emotion?: string;
}

const DayItem = ({ day, emotion }: DayItemProps) => {
  return (
    <div className="flex h-24 flex-col p-3">
      {day > 0 && (
        <>
          <p className="text-xs">{String(day).padStart(2, '0')}</p>
          {emotion && <p className="my-2 text-center text-4xl">{emotion}</p>}
        </>
      )}
    </div>
  );
};

export default DayItem;
