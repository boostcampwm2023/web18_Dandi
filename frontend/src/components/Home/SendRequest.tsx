import { useQuery } from '@tanstack/react-query';

import { getRequestList } from '@/api/FriendModal';

import FriendModalItem from '@components/Home/FriendModalItem';

import { PROFILE_BUTTON_TYPE } from '@/util/constants';

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
  userId: string;
}

const SendRequest = ({ userId }: SendRequestProps) => {
  const sendData = useQuery({
    queryKey: ['sendList', userId],
    queryFn: () => getRequestList(userId),
  });

  if (sendData.isLoading) {
    return <p>보낸 친구 신청목록을 불러오는 중...</p>;
  }

  if (sendData.isError) {
    return <p>보낸 친구 신청목록을 불러오지 못했습니다!</p>;
  }

  const ReceivedList = sendData.data.strangers.filter((v: SendListResponse) => {
    if (v.senderId === userId) {
      const newObj = {
        email: v.email,
        nickname: v.nickname,
        userId: v.receiverId,
        profileImage: v.profileImage,
      };
      return newObj;
    }
  });

  return ReceivedList.map((data: SendList, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.SEND} />
  ));
};

export default SendRequest;
