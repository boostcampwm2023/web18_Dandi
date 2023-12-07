import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSearchUserList } from '@api/FriendModal';
import cryingFace from '@assets/image/cryingFace.png';

import FriendModalItem from '@components/Home/FriendModalItem';

import { PROFILE_BUTTON_TYPE } from '@util/constants';

interface UserSearchContentProps {
  nickname: string;
}

interface UserListResponse {
  id: string;
  email: string;
  nickname: string;
  profileImage: string;
}

const UserSearchContent = ({ nickname }: UserSearchContentProps) => {
  const userSearchData = useQuery({
    queryKey: ['searchUserList', nickname],
    queryFn: () => getSearchUserList(nickname),
    enabled: !!nickname,
  });

  useEffect(() => {
    if (nickname !== '') {
      userSearchData.refetch();
    }
  }, [nickname]);

  if (userSearchData.isLoading) {
    return <p></p>;
  }

  if (userSearchData.isError) {
    return <p>유저검색에 실패했습니다.</p>;
  }

  const loginUserId = localStorage.getItem('userId') ?? 0;
  const AnotherUserData = userSearchData.data.filter(
    (data: UserListResponse) => +data.id !== +loginUserId,
  );

  if (AnotherUserData.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <img className="w-1/3" src={cryingFace} alt="우는 이모티콘" />
        <p className="font-bold">검색된 사용자가 없어요.</p>
      </div>
    );
  }

  return AnotherUserData.map((data: UserListResponse, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.STRANGER} />
  ));
};

export default UserSearchContent;
