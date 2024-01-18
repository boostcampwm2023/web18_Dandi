import { useQuery } from '@tanstack/react-query';

import { getReactionList } from '@api/Reaction';

import { reactQueryKeys } from '@util/constants';

const useReactionListQuery = (diaryId: number) => {
  return useQuery({
    queryKey: [reactQueryKeys.ReactionList, diaryId],
    queryFn: () => getReactionList(diaryId),
  });
};

export default useReactionListQuery;
