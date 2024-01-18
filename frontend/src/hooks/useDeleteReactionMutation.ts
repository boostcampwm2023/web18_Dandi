import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteReaction } from '@api/Reaction';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useDeleteReactionMutation = (userId: string, diaryId: number, selectedEmoji: string) => {
  const queryClient = useQueryClient();
  const openToast = useToast();
  return useMutation({
    mutationFn: () => deleteReaction(diaryId, selectedEmoji),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [reactQueryKeys.DayDiaryList, userId],
      });
      queryClient.removeQueries({
        queryKey: [reactQueryKeys.MyDayDiaryList, userId],
      });
      openToast('공감을 취소했습니다!');
    },
  });
};

export default useDeleteReactionMutation;
