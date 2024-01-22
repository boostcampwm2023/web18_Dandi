import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postReaction } from '@api/Reaction';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const usePostReactionMutation = (userId: number, diaryId: number, selectedEmoji: string) => {
  const queryClient = useQueryClient();
  const openToast = useToast();
  return useMutation({
    mutationFn: () => postReaction(diaryId, selectedEmoji),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [reactQueryKeys.DayDiaryList, userId],
      });
      queryClient.removeQueries({
        queryKey: [reactQueryKeys.MyDayDiaryList, userId],
      });
      openToast('공감을 남겼습니다!');
    },
  });
};

export default usePostReactionMutation;
