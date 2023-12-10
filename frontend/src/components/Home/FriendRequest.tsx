import { useState } from 'react';

import ReceivedRequest from '@components/Home/ReceivedRequest';
import SendRequest from '@components/Home/SendRequest';
import Icon from '@components/Common/Icon';
import UserSearchContent from '@components/Home/UserSearchContent';

interface FriendRequestProps {
  userId: number;
}

const FriendRequest = ({ userId }: FriendRequestProps) => {
  const [nickname, setNickname] = useState('');

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div className="px-5">
      <div className="relative mb-6 flex flex-col">
        <label className="mb-2 text-2xl font-bold" htmlFor="userSearch">
          유저 찾기
        </label>
        <input
          className="border-brown h-10 w-full rounded-lg border-2 pl-3 outline-none"
          type="text"
          name="userSearch"
          id="userSearch"
          placeholder="닉네임"
          value={nickname}
          onChange={onChangeNickname}
        />
        <Icon id={'search'} styles="absolute top-[60%] right-[1%]" />
      </div>
      {!nickname && (
        <div>
          <div>
            <p className="mb-2 text-2xl font-bold">받은 신청</p>
            <div className="flex h-40 flex-wrap justify-between overflow-scroll">
              <ReceivedRequest userId={userId} />
            </div>
          </div>

          <div>
            <p className="mb-2  text-2xl font-bold">보낸 신청</p>
            <div className="flex h-40 flex-wrap justify-between overflow-scroll">
              <SendRequest userId={userId} />
            </div>
          </div>
        </div>
      )}
      {nickname && (
        <div>
          <p className="mb-6 text-2xl font-bold">검색 결과</p>
          <div className="flex flex-wrap justify-between">
            <UserSearchContent nickname={nickname} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
