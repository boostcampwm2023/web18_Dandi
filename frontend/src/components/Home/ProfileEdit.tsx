interface ProfileEditProps {
  profileImage: string;
  nickname: string;
  userId: string;
}

const ProfileEdit = () => {
  const { profileImage, nickname }: ProfileEditProps = {
    profileImage:
      'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
    nickname: '단디',
    userId: '1',
  };

  return (
    <div className="px-5">
      <p className="mb-6 text-2xl font-bold">내 정보 수정</p>
      <div className="mb-5 flex flex-col items-center">
        <img
          className="mb-10 h-52 w-52 rounded-full"
          src={profileImage}
          alt={`${nickname} 프로필 이미지`}
        />
        <input
          className="border-brown mb-3 h-10 w-1/2 rounded-xl border pl-3 outline-none"
          type="text"
          name="friendSearch"
          id="friendSearch"
          placeholder={nickname}
        />
        <button className="bg-mint w-1/2 rounded-xl py-2 font-bold">수정하기</button>
      </div>
    </div>
  );
};

export default ProfileEdit;
