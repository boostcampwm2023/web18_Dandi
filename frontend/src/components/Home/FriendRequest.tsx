import FriendModalItem from '@components/Home/FriendModalItem';

interface FriendRequestProps {
  email: string;
  profileImage: string;
  nickname: string;
  userId: string;
}

const FriendRequest = () => {
  const dummyData: FriendRequestProps = {
    profileImage:
      'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
    nickname: '단디',
    userId: '1',
    email: 'dandi@naver.com',
  };

  return (
    <div className="px-5">
      <div>
        <p className="mb-6 text-2xl font-bold">받은 신청</p>
        <div className="flex flex-wrap justify-between">
          <FriendModalItem {...dummyData} type="received" />
          <FriendModalItem {...dummyData} type="received" />
        </div>
      </div>

      <div>
        <p className="mb-6 text-2xl font-bold">보낸 신청</p>
        <div className="flex flex-wrap justify-between">
          <FriendModalItem {...dummyData} type="send" />
          <FriendModalItem {...dummyData} type="send" />
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
