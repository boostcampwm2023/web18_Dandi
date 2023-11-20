import Button from '@components/Common/Button';

interface ProfileProps {
  nickname: string;
  profileImage: string;
  totalFriends: number;
  isExistedTodayDiary: boolean;
}

export const Profile = ({
  nickname,
  profileImage,
  totalFriends,
  isExistedTodayDiary,
}: ProfileProps) => {
  const greetMessages = ['좋은 하루예요!', '안녕하세요!', '반가워요!'];
  const getRandomIndex = Math.floor(Math.random() * greetMessages.length);

  return (
    <section className="flex flex-col items-center justify-center gap-14">
      <div className="flex flex-row items-center justify-center">
        <img
          className="h-52 w-52 rounded-full object-cover"
          src={profileImage}
          alt="나의 프로필 사진"
        />
        <div className="ml-10">
          <p className="mb-8 text-3xl font-bold">
            {nickname}님, {greetMessages[getRandomIndex]}
          </p>
          <div className="border-brown grid w-max grid-flow-col rounded-2xl border-2 border-solid p-5 text-center text-lg font-bold">
            <p className="cursor-pointer">친구 {totalFriends}명</p>
            <div className="border-brown w mx-5 border-l-2 border-solid" />
            <p className="cursor-pointer">친구 관리</p>
            <div className="border-brown w mx-5 border-l-2 border-solid" />
            <p className="cursor-pointer">내 정보 수정</p>
          </div>
        </div>
      </div>
      {isExistedTodayDiary ? (
        <>
          <div className="text-center text-2xl font-bold">
            <p>오늘 일기를 작성하셨네요!</p>
            <p>작성하신 일기를 보여드릴게요.</p>
          </div>
          <Button
            width={36}
            height={4.6875}
            text={'오늘 하루 보러 가기'}
            fontColor="default"
            fontSize="xl"
            backgroundColor="mint"
            onClick={() => console.log('일기 보러 가기')}
          />
        </>
      ) : (
        <>
          <div className="text-center text-2xl font-bold">
            <p>아직 오늘 일기를 작성하지 않으셨네요!</p>
            <p>일기를 작성해볼까요?</p>
          </div>
          <Button
            width={36}
            height={4.6875}
            text={'오늘 하루 기록하기'}
            fontColor="default"
            fontSize="2xl"
            backgroundColor="mint"
            onClick={() => console.log('일기 쓰러 가기')}
          />
        </>
      )}
    </section>
  );
};
