import { useQuery } from '@tanstack/react-query';

import { getRequestList } from '@/api/FriendModal';

import FriendModalItem from '@components/Home/FriendModalItem';

import { PROFILE_BUTTON_TYPE } from '@/util/constants';

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
  const ReceivedData = useQuery({
    queryKey: ['receivedList', userId],
    queryFn: () => getRequestList(userId),
  });

  if (ReceivedData.isLoading) {
    return <p>받은 친구 신청목록을 불러오는 중...</p>;
  }

  if (ReceivedData.isError) {
    return <p>받은 친구 신청목록을 불러오지 못했습니다!</p>;
  }

  const ReceivedList = ReceivedData.data.strangers.filter((v: ReceivedListResponse) => {
    if (v.senderId === userId) {
      const newObj = {
        email: v.email,
        nickname: v.nickname,
        userId: v.senderId,
        profileImage: v.profileImage,
      };
      return newObj;
    }
  });

  return ReceivedList.map((data: ReceivedList, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.SEND} />
  ));
};

export default ReceivedRequest;
