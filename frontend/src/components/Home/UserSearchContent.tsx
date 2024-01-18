import { useEffect, useState } from 'react';

import cryingFace from '@assets/image/cryingFace.png';

import { getSearchUserList } from '@api/FriendModal';

import FriendModalItem from '@components/Home/FriendModalItem';

import { PROFILE_BUTTON_TYPE, DEBOUNCE_TIME } from '@util/constants';

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
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!nickname) return;
      const result = await getSearchUserList(nickname);
      setUserList(result);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timer);
  }, [nickname]);

  const loginUserId = localStorage.getItem('userId') ?? 0;
  const AnotherUserData = userList.filter((data: UserListResponse) => +data.id !== +loginUserId);

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
