import { useQuery } from '@tanstack/react-query';

import { getRequestList } from '@api/FriendModal';
import { reactQueryKeys } from '@util/constants';

const useReceivedList = (userId: number) => {
  return useQuery({
    queryKey: [reactQueryKeys.ReceivedList, userId],
    queryFn: () => getRequestList(userId),
  });
};

export default useReceivedList;
