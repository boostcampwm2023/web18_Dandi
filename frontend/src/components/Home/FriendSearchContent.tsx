import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { recommendFriend } from '@api/FriendModal';

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

  return recommendData.data.map((data: FriendListResponse, index: number) => (
    <FriendModalItem key={index} {...data} type={PROFILE_BUTTON_TYPE.LIST} />
  ));
};

export default FriendSearchContent;
