import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfile } from '@api/FriendModal';

import { useToast } from '@hooks/useToast';

import { reactQueryKeys } from '@util/constants';

const useUpdateProfileMutation = (userId: string) => {
  const queryClient = useQueryClient();
  const openToast = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.ProfileData, userId],
      });
      openToast('프로필 정보가 수정되었습니다.');
    },
    onError() {
      openToast('사진의 크기는 최대 10MB입니다.');
    },
  });
};

export default useUpdateProfileMutation;
