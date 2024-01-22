import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteFriend } from '@api/FriendModal';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useDeleteFriendMutation = () => {
  const queryClient = useQueryClient();
  const openToast = useToast();

  return useMutation({
    mutationFn: (friendId: number) => deleteFriend(friendId),
    onSuccess() {
      openToast('친구가 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.FriendList],
      });
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.ProfileData],
      });
    },
  });
};

export default useDeleteFriendMutation;
