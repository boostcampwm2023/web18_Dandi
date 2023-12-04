import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSearchUserList } from '@api/FriendModal';

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

  return userSearchData.data.map((data: UserListResponse, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.STRANGER} />
  ));
};

export default UserSearchContent;
