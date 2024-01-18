import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rejectFriend } from '@api/FriendModal';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useRejectFriendMutation = () => {
  const DB_WAITING_TIME = 100;

  const queryClient = useQueryClient();
  const openToast = useToast();

  return useMutation({
    mutationFn: (senderId: number) => rejectFriend(senderId),
    onSuccess() {
      openToast('친구 요청을 거절하였습니다.');
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [reactQueryKeys.ReceivedList],
        });
      }, DB_WAITING_TIME);
    },
  });
};

export default useRejectFriendMutation;
