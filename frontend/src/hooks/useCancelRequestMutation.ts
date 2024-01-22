import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelRequestFriend } from '@api/FriendModal';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useCancelRequestMutation = () => {
  const DB_WAITING_TIME = 100;

  const queryClient = useQueryClient();
  const openToast = useToast();

  return useMutation({
    mutationFn: (receiverId: number) => cancelRequestFriend(receiverId),
    onSuccess() {
      openToast('친구 신청을 취소했습니다.');
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [reactQueryKeys.SendList],
        });
      }, DB_WAITING_TIME);
    },
  });
};

export default useCancelRequestMutation;
