import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteDiary } from '@api/Detail';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useDeleteDiaryMutation = (userId: string, diaryId: number) => {
  const queryClient = useQueryClient();
  const openToast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteDiary(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.Grass, userId],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.EmotionStat, userId],
        refetchType: 'all',
      });
      queryClient.removeQueries({
        queryKey: [reactQueryKeys.DayDiaryList, userId],
      });
      queryClient.removeQueries({
        queryKey: [reactQueryKeys.MyDayDiaryList, userId],
      });
      navigate(-1);
      openToast('일기가 삭제되었습니다!');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useDeleteDiaryMutation;
