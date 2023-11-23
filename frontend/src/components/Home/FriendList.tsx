import Icon from '@components/Common/Icon';
import FriendModalItem from '@components/Home/FriendModalItem';

interface FriendListProps {
  email: string;
  profileImage: string;
  nickname: string;
  userId: string;
}

const FriendList = () => {
  const dummyData: FriendListProps = {
    profileImage:
      'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
    nickname: '단디',
    userId: '1',
    email: 'dandi@naver.com',
  };

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
          <FriendModalItem {...dummyData} type="list" />
          <FriendModalItem {...dummyData} type="list" />
          <FriendModalItem {...dummyData} type="list" />
          <FriendModalItem {...dummyData} type="list" />
        </div>
      </div>
    </div>
  );
};

export default FriendList;
