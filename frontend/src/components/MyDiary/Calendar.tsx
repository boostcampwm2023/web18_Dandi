import DayItem from '@components/MyDiary/DayItem';
import { EmotionData } from '@type/components/MyDiary/MonthContainer';

import { DAY_OF_WEEK, START_INDEX, WEEK_INDEX } from '@util/constants';

interface CalendarProp {
  first: Date;
  last: Date;
  emotionData?: EmotionData;
}

const Calendar = ({ first, last, emotionData }: CalendarProp) => {
  const allDayCount = Math.ceil((last.getDate() - first.getDate() + first.getDay()) / WEEK_INDEX);
  const monthData = Array.from(Array(allDayCount), () => Array(WEEK_INDEX).fill(0));
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
    <table className="overflow-hidden rounded-lg border-hidden shadow-[0_0_0_1px_#C7C1BB]">
      <thead>
        <tr className="bg-brown text-base text-white">
          {DAY_OF_WEEK.map((dayName) => (
            <th key={dayName} className="px-7 py-4 font-medium">
              {dayName}
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
                  diaryId={emotionData && emotionData[day] ? emotionData[day].diaryId : undefined}
                  emotion={emotionData && emotionData[day] ? emotionData[day].emotion : undefined}
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
