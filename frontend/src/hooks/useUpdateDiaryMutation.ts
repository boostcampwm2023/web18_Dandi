import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDiary } from '@api/Edit';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys, PAGE_URL } from '@util/constants';

interface CreateDiaryParams {
  title: string;
  content: string;
  thumbnail?: string;
  emotion: string;
  tagNames?: string[];
  status: string;
}

const useUpdateDiaryMutation = (userId: string, diaryId: number) => {
  const queryClient = useQueryClient();
  const openToast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (params: CreateDiaryParams) => updateDiary(params, diaryId),
    onSuccess: () => {
      navigate(`${PAGE_URL.DETAIL}/${diaryId}`);
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
      openToast('일기가 수정되었습니다!');
    },
  });
};

export default useUpdateDiaryMutation;
