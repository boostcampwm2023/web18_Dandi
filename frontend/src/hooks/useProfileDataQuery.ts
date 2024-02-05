import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@api/Profile';

import { reactQueryKeys } from '@util/constants';

const useProfileDataQuery = (userId: number) => {
  return useQuery({
    queryKey: [reactQueryKeys.ProfileData, userId],
    queryFn: () => getCurrentUser(userId),
  });
};

export default useProfileDataQuery;
