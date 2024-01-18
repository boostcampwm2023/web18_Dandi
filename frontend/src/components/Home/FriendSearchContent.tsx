import { useEffect, useState } from 'react';

import cryingCat from '@assets/image/cryingCat.png';

import { recommendFriend } from '@api/FriendModal';

import FriendModalItem from '@components/Home/FriendModalItem';

import { DEBOUNCE_TIME, PROFILE_BUTTON_TYPE } from '@util/constants';

interface FriendSearchContentProps {
  nickname: string;
}

interface FriendListResponse {
  id: string;
  email: string;
  nickname: string;
  profileImage: string;
}

const FriendSearchContent = ({ nickname }: FriendSearchContentProps) => {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!nickname) return;
      const result = await recommendFriend(nickname);
      setFriendList(result);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timer);
  }, [nickname]);

  if (friendList.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <img className="w-1/3" src={cryingCat} alt="우는 이모티콘" />
        <p className="font-bold">검색된 친구가 없어요.</p>
      </div>
    );
  }

  return friendList.map((data: FriendListResponse, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.LIST} />
  ));
};

export default FriendSearchContent;
