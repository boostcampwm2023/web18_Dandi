import { useQuery } from '@tanstack/react-query';

import { getRequestList } from '@api/FriendModal';

const useRequestListQuery = (queryKey: string, userId: number) => {
  return useQuery({
    queryKey: [queryKey, userId],
    queryFn: () => getRequestList(userId),
  });
};

export default useRequestListQuery;
