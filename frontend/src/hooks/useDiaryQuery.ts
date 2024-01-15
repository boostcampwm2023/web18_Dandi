import { useQuery } from '@tanstack/react-query';

import { referDiary } from '@api/Detail';
import { reactQueryKeys } from '@util/constants';

const useDiaryQuery = (diaryId: number) => {
  return useQuery({
    queryKey: [reactQueryKeys.Diary, diaryId],
    queryFn: () => referDiary(diaryId),
  });
};

export default useDiaryQuery;