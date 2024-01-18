import { useQuery } from '@tanstack/react-query';

import getGrass from '@api/Grass';

import { reactQueryKeys } from '@util/constants';

const useGrassQuery = (userId: string) => {
  return useQuery({
    queryKey: [reactQueryKeys.Grass, userId],
    queryFn: () => getGrass(Number(userId)),
    staleTime: Infinity,
  });
};

export default useGrassQuery;
