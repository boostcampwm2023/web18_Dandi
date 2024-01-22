import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import useCancelRequestMutation from '@hooks/useCancelRequestMutation';
import useDeleteFriendMutation from '@hooks/useDeleteFriendMutation';
import useAllowFriendMutation from '@hooks/useAllowFriendMutation';
import useRejectFriendMutation from '@hooks/useRejectFriendMutation';

import { PROFILE_BUTTON_TYPE, PAGE_URL, reactQueryKeys } from '@util/constants';

interface FriendModalItemProps {
  email: string;
  profileImage: string;
  nickname: string;
  id: string;
  type: string;
}

const FriendModalItem = ({ email, profileImage, nickname, id, type }: FriendModalItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const goFriendHome = () => {
    navigate(`${PAGE_URL.HOME}${id}`);
    queryClient.removeQueries({
      queryKey: [reactQueryKeys.ProfileData],
    });
  };

  const cancelRequestMutation = useCancelRequestMutation();

  const deleteFriendMutation = useDeleteFriendMutation();

  const allowFriendMutation = useAllowFriendMutation();

  const rejectFriendMutation = useRejectFriendMutation();

  const getButtonElement = (type: string) => {
    switch (type) {
      case PROFILE_BUTTON_TYPE.LIST:
        return (
          <button
            onClick={() => {
              deleteFriendMutation.mutate(+id);
            }}
            className="bg-mint w-3/5 rounded-md border-none px-2 py-1 text-[0.7rem] font-bold"
          >
            친구 삭제
          </button>
        );
      case PROFILE_BUTTON_TYPE.RECEIVED:
        return (
          <div className="flex gap-2">
            <button
              onClick={() => {
                rejectFriendMutation.mutate(+id);
              }}
              className="bg-red w-2/5 rounded-md border-none px-2 py-1 text-[0.7rem] font-bold text-white"
            >
              거절
            </button>
            <button
              onClick={() => {
                allowFriendMutation.mutate(+id);
              }}
              className="bg-mint w-2/5 rounded-md border-none px-2 py-1 text-[0.7rem] font-bold"
            >
              수락
            </button>
          </div>
        );
      case PROFILE_BUTTON_TYPE.SEND:
        return (
          <button
            onClick={() => {
              cancelRequestMutation.mutate(+id);
            }}
            className="bg-red w-3/5 rounded-md border-none px-2 py-1 text-[0.7rem] font-bold text-white"
          >
            신청 취소
          </button>
        );
      case PROFILE_BUTTON_TYPE.STRANGER:
        return <div></div>;
    }
  };

  const buttonContent = getButtonElement(type);

  return (
    <div className="mb-5 mr-3 flex w-full">
      <div className="w-28">
        <img
          className="mr-3 h-16 w-16 cursor-pointer rounded-full object-cover"
          onClick={goFriendHome}
          src={profileImage}
          alt={`${nickname} 프로필 이미지`}
        />
      </div>
      <div className="flex w-full flex-col">
        <p className="text-sm font-bold">{nickname}</p>
        <p className="text-gray text-xs">{email}</p>
        {buttonContent}
      </div>
    </div>
  );
};

export default FriendModalItem;
