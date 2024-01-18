import { useQuery } from '@tanstack/react-query';

import { getDiaryWeekAndMonthList } from '@api/DiaryList';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import { reactQueryKeys } from '@util/constants';
import { formatDateDash } from '@util/funcs';

const useMyWeekDiaryQuery = (userId: string, period: Date[]) => {
  return useQuery<{ nickname: string; diaryList: IDiaryContent[] }>({
    queryKey: [
      reactQueryKeys.MyWeekDiary,
      userId,
      formatDateDash(period[0]),
      formatDateDash(period[1]),
    ],
    queryFn: () =>
      getDiaryWeekAndMonthList({
        userId: userId,
        type: 'Week',
        startDate: formatDateDash(period[0]),
        endDate: formatDateDash(period[1]),
      }),
  });
};

export default useMyWeekDiaryQuery;
