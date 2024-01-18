import { useQuery } from '@tanstack/react-query';

import { getDiaryWeekAndMonthList } from '@api/DiaryList';

import { IDiaryContent } from '@type/components/Common/DiaryList';
import { EmotionData } from '@type/components/MyDiary/MonthContainer';

import { reactQueryKeys } from '@util/constants';
import { formatDateDash } from '@util/funcs';

const useMonthDiaryDataQuery = (userId: string, nowMonth: Date, first: Date, last: Date) => {
  return useQuery({
    queryKey: [reactQueryKeys.MonthDiaryData, userId, formatDateDash(nowMonth)],
    queryFn: () =>
      getDiaryWeekAndMonthList({
        userId: userId,
        type: 'Month',
        startDate: formatDateDash(first),
        endDate: formatDateDash(last),
      }),
    select: (data) => {
      const emotionObject: EmotionData = {};
      data.diaryList.forEach((diary: IDiaryContent) => {
        const { diaryId, emotion, createdAt } = diary;
        const day = new Date(createdAt).getDate();
        emotionObject[day] = { diaryId: +diaryId, emotion: emotion };
      });
      return emotionObject;
    },
  });
};

export default useMonthDiaryDataQuery;
