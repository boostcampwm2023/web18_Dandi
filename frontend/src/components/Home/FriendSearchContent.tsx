import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { recommendFriend } from '@api/FriendModal';
import cryingCat from '@assets/image/cryingCat.png';

import FriendModalItem from '@components/Home/FriendModalItem';

import { PROFILE_BUTTON_TYPE } from '@util/constants';

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
  const recommendData = useQuery({
    queryKey: ['recommendFriend', nickname],
    queryFn: () => recommendFriend(nickname),
    enabled: !!nickname,
  });

  useEffect(() => {
    if (nickname !== '') {
      recommendData.refetch();
    }
  }, [nickname]);

  if (recommendData.isLoading) {
    return <p></p>;
  }

  if (recommendData.isError) {
    return <p>친구검색을 불러오지 못했습니다!</p>;
  }

  if (recommendData.data.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <img className="w-1/3" src={cryingCat} alt="우는 이모티콘" />
        <p className="font-bold">검색된 친구가 없어요.</p>
      </div>
    );
  }

  return recommendData.data.map((data: FriendListResponse, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.LIST} />
  ));
};

export default FriendSearchContent;
