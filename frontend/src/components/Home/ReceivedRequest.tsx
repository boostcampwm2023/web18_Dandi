import faceWithPeekingEye from '@assets/image/faceWithPeekingEye.png';

import FriendModalItem from '@components/Home/FriendModalItem';
import useReceivedListQuery from '@hooks/useReceivedListQuery';
import { PROFILE_BUTTON_TYPE } from '@util/constants';

interface ReceivedListResponse {
  senderId: number;
  receiverId: number;
  email: string;
  nickname: string;
  profileImage: string;
}

interface ReceivedRequestProps {
  userId: number;
}

interface ReceivedList {
  email: string;
  profileImage: string;
  nickname: string;
  id: string;
}

const ReceivedRequest = ({ userId }: ReceivedRequestProps) => {
  const {data, isLoading, isError} = useReceivedListQuery(userId);

  if (isLoading) {
    return <p>받은 친구 신청목록을 불러오는 중...</p>;
  }

  if (isError) {
    return <p>받은 친구 신청목록을 불러오지 못했습니다!</p>;
  }

  const ReceivedList = data.strangers
    .filter((v: ReceivedListResponse) => v.receiverId === userId)
    .map((v: ReceivedListResponse) => {
      const newObj = {
        email: v.email,
        nickname: v.nickname,
        id: v.senderId,
        profileImage: v.profileImage,
      };
      return newObj;
    });

  if (ReceivedList.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <img
          className="w-1/3 max-w-[100px]"
          src={faceWithPeekingEye}
          alt="받은 친구요청이 없는 그림"
        />
        <p className="font-bold">받은 친구요청이 없어요.</p>
      </div>
    );
  }

  return ReceivedList.map((data: ReceivedList, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.RECEIVED} />
  ));
};

export default ReceivedRequest;
