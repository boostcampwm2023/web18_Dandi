import faceWithPeekingEye from '@assets/image/faceWithPeekingEye.png';

import FriendModalItem from '@components/Home/FriendModalItem';
import useSendListQuery from '@hooks/useSendListQuery';
import { PROFILE_BUTTON_TYPE } from '@util/constants';

interface SendRequestProps {
  userId: number;
}

interface SendListResponse {
  senderId: number;
  receiverId: number;
  email: string;
  nickname: string;
  profileImage: string;
}
interface SendList {
  email: string;
  profileImage: string;
  nickname: string;
  id: string;
}

const SendRequest = ({ userId }: SendRequestProps) => {
  const { data, isLoading, isError } = useSendListQuery(userId);

  if (isLoading) {
    return <p>보낸 친구 신청목록을 불러오는 중...</p>;
  }

  if (isError) {
    return <p>보낸 친구 신청목록을 불러오지 못했습니다!</p>;
  }

  const sendList = data.strangers
    .filter((v: SendListResponse) => v.senderId === userId)
    .map((v: SendListResponse) => {
      const newObj = {
        email: v.email,
        nickname: v.nickname,
        id: v.receiverId,
        profileImage: v.profileImage,
      };
      return newObj;
    });

  if (sendList.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <img
          className="w-1/3 max-w-[100px]"
          src={faceWithPeekingEye}
          alt="보낸 친구요청이 없는 그림"
        />
        <p className="font-bold">보낸 친구요청이 없어요.</p>
      </div>
    );
  }

  return sendList.map((data: SendList, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.SEND} />
  ));
};

export default SendRequest;
