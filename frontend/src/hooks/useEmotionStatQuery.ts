import { useQuery } from '@tanstack/react-query';

import getEmotionStat from '@api/EmotionStat';
import { reactQueryKeys } from '@util/constants';
import { formatDateDash } from '@util/funcs';

const useEmotionStatQuery = (userId: string, period: Date[]) => {
  return useQuery({
    queryKey: [
      reactQueryKeys.EmotionStat,
      userId,
      formatDateDash(period[0]),
      formatDateDash(period[1]),
    ],
    queryFn: () =>
      getEmotionStat(Number(userId), formatDateDash(period[0]), formatDateDash(period[1])),
    staleTime: Infinity,
  });
};

export default useEmotionStatQuery;
