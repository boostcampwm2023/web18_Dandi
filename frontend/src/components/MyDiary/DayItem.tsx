import { useNavigate } from 'react-router-dom';

import { PAGE_URL } from '@util/constants';

interface DayItemProps {
  day: number;
  emotion?: string;
  diaryId?: number;
}

const DayItem = ({ day, emotion, diaryId }: DayItemProps) => {
  const navigate = useNavigate();
  const goDetail = () => navigate(`${PAGE_URL.DETAIL}/${diaryId}`);
  return (
    <div className="flex h-20 flex-col p-3 sm:h-24" onClick={diaryId ? goDetail : undefined}>
      {day > 0 && (
        <>
          <p className="text-xs">{String(day).padStart(2, '0')}</p>
          {emotion && (
            <p className="my-1 cursor-pointer text-center text-2xl sm:my-2 sm:text-4xl">
              {emotion}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DayItem;
