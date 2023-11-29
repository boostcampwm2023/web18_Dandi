import { useQuery } from '@tanstack/react-query';

import { getFriendList } from '@/api/FriendModal';

import Icon from '@components/Common/Icon';
import FriendModalItem from '@components/Home/FriendModalItem';
import { PROFILE_BUTTON_TYPE } from '@/util/constants';

interface FriendListProps {
  userId: number;
}

interface FriendListResponse {
  userId: string;
  email: string;
  nickname: string;
  profileImage: string;
}

const FriendList = ({ userId }: FriendListProps) => {
  const {
    data: friendListData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['friendList', userId],
    queryFn: () => getFriendList(+userId),
  });

  if (isLoading) {
    return <p>친구목록 가져오는 중...</p>;
  }

  if (isError) {
    return <p>친구목록을 불러오지 못했습니다!</p>;
  }

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
          placeholder="닉네임이나 이메일을 입력해주세요."
        />
        <Icon id={'search'} styles="absolute top-2/3 right-[1%]" />
      </div>

      <div>
        <p className="mb-6 text-2xl font-bold">친구 목록</p>
        <div className="flex flex-wrap justify-between">
          {friendListData.friends.map((data: FriendListResponse) => {
            <FriendModalItem {...data} type={PROFILE_BUTTON_TYPE.LIST} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
