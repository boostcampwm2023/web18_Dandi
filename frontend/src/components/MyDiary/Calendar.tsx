import { EmotionData } from '@type/components/MyDiary/MonthContainer';

import DayItem from '@components/MyDiary/DayItem';

import { DAY_OF_WEEK, SM, START_INDEX, WEEK_INDEX } from '@util/constants';

interface CalendarProp {
  first: Date;
  last: Date;
  emotionData?: EmotionData;
}

const Calendar = ({ first, last, emotionData }: CalendarProp) => {
  const allDayCount = Math.ceil((last.getDate() - first.getDate() + first.getDay()) / WEEK_INDEX);
  const monthData = Array.from(Array(allDayCount), () => Array(WEEK_INDEX).fill(0));
  const isWidthSM = window.innerWidth >= SM;
  let day = 1;

  for (let weekIndex = START_INDEX; weekIndex < allDayCount; weekIndex++) {
    for (let dayIndex = START_INDEX; dayIndex < WEEK_INDEX; dayIndex++) {
      if (weekIndex === START_INDEX && dayIndex < first.getDay()) {
        continue;
      }
      if (day > last.getDate()) {
        break;
      }
      monthData[weekIndex][dayIndex] = day;
      day++;
    }
  }

  return (
    <table className="overflow-hidden rounded-lg border-hidden bg-white shadow-[0_0_0_1px_#C7C1BB]">
      <thead>
        <tr className="bg-brown text-base text-white">
          {DAY_OF_WEEK.map((dayName) => (
            <th key={dayName} className="px-5 py-4 text-sm font-medium sm:px-7 sm:text-base">
              {isWidthSM ? dayName : dayName.replace('요일', '')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {monthData.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((day, dayIndex) => (
              <td
                key={weekIndex + dayIndex}
                className="border-brown first:text-red last:text-blue border border-solid"
              >
                <DayItem
                  day={day}
                  diaryId={emotionData?.[day]?.diaryId}
                  emotion={emotionData?.[day]?.emotion}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Calendar;
