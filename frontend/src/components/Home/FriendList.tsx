import { useState } from 'react';

import cryingCat from '@assets/image/cryingCat.png';

import Icon from '@components/Common/Icon';
import FriendModalItem from '@components/Home/FriendModalItem';
import FriendSearchContent from '@components/Home/FriendSearchContent';

import useFriendListDataQuery from '@hooks/useFriendListQuery';

import { PROFILE_BUTTON_TYPE } from '@util/constants';

interface FriendListProps {
  userId: number;
}

interface FriendListResponse {
  id: string;
  email: string;
  nickname: string;
  profileImage: string;
}

const FriendList = ({ userId }: FriendListProps) => {
  const [nickname, setNickname] = useState('');

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const friendListData = useFriendListDataQuery(userId);

  if (friendListData.isLoading) {
    return <p>친구목록 가져오는 중...</p>;
  }

  if (friendListData.isError) {
    return <p>친구목록을 불러오지 못했습니다!</p>;
  }

  const loginUser = localStorage.getItem('userId') ?? 0;
  const profileItemType =
    +loginUser === userId ? PROFILE_BUTTON_TYPE.LIST : PROFILE_BUTTON_TYPE.STRANGER;

  return (
    <div className="px-5">
      <div className="relative mb-6 flex flex-col">
        <label className="mb-6 text-2xl font-bold" htmlFor="friendSearch">
          친구 검색
        </label>
        <input
          className="border-brown h-10 w-full rounded-lg border-2 pl-3 outline-none"
          type="text"
          name="friendSearch"
          id="friendSearch"
          placeholder="닉네임"
          value={nickname}
          onChange={onChangeNickname}
        />
        <Icon id={'search'} styles="absolute top-2/3 right-[1%]" />
      </div>

      {!nickname && (
        <div>
          <p className="mb-2 text-2xl font-bold">친구 목록</p>
          <div className="flex h-60 flex-wrap justify-between overflow-scroll">
            {friendListData.data.friends.length !== 0 ? (
              friendListData.data.friends.map((data: FriendListResponse, index: number) => (
                <FriendModalItem key={index} {...data} type={profileItemType} />
              ))
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-3">
                <img className="w-1/3 max-w-[150px]" src={cryingCat} alt="우는 이모티콘" />
                <p className="font-bold">아직 친구가 없어요.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {nickname && (
        <div>
          <p className="mb-2 text-2xl font-bold">검색 결과</p>
          <div className="flex flex-wrap justify-between">
            <FriendSearchContent nickname={nickname} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
