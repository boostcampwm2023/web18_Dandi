import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@api/Profile';

import { reactQueryKeys } from '@util/constants';

const useProfileDataQuery = (userId: string) => {
  return useQuery({
    queryKey: [reactQueryKeys.ProfileData, userId],
    queryFn: () => getCurrentUser(userId ? +userId : 0),
  });
};

export default useProfileDataQuery;
