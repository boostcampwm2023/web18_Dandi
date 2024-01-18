import { useMutation, useQueryClient } from '@tanstack/react-query';

import { allowFriend } from '@api/FriendModal';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useAllowFriendMutation = () => {
  const queryClient = useQueryClient();
  const openToast = useToast();

  return useMutation({
    mutationFn: (senderId: number) => allowFriend(senderId),
    onSuccess() {
      openToast('친구 요청을 수락하였습니다.');
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.ReceivedList],
      });
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.ProfileData],
      });
    },
  });
};

export default useAllowFriendMutation;
