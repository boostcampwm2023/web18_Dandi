import { DAY_OF_WEEK } from '@util/Calendar';
import DayItem from './DayItem';

interface CalendarProp {
  date: Date;
}

const Calendar = ({ date }: CalendarProp) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const allDayCount = Math.ceil((last.getDate() - first.getDate() + first.getDay()) / 7);
  const monthData = Array.from(Array(allDayCount), () => Array(7).fill(0));
  let day = 1;

  for (let weekIndex = 0; weekIndex < allDayCount; weekIndex++) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      if (weekIndex === 0 && dayIndex < first.getDay()) {
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
                <DayItem day={day} emotion={day > 0 ? '💜' : undefined} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Calendar;
