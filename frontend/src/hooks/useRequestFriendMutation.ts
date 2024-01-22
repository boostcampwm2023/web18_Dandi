import { useMutation, useQueryClient } from '@tanstack/react-query';

import { requestFriend } from '@api/FriendModal';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useRequestFriendMutation = () => {
  const DB_WAITING_TIME = 100;

  const queryClient = useQueryClient();
  const openToast = useToast();

  return useMutation({
    mutationFn: (senderId: number) => requestFriend(senderId),
    onSuccess() {
      openToast('친구 요청을 보냈습니다.');
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [reactQueryKeys.SendList],
        });
        queryClient.invalidateQueries({
          queryKey: [reactQueryKeys.ProfileData],
        });
      }, DB_WAITING_TIME);
    },
  });
};

export default useRequestFriendMutation;
