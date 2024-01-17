import { useQuery } from '@tanstack/react-query';

import { getReactionList } from '@api/Reaction';
import { reactQueryKeys } from '@util/constants';

const useReactionList = (diaryId: number) => {
  return useQuery({
    queryKey: [reactQueryKeys, diaryId],
    queryFn: () => getReactionList(diaryId),
  });
};

export default useReactionList;
