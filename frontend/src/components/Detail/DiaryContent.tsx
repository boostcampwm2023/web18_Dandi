import ProfileItem from '@components/Common/ProfileItem';
import Reaction from '@components/Common/Reaction';

const DiaryContent = () => {
  const diaryData = [
    {
      createdAt: '2023-11-13T13:50:17.106Z',
      profileImage: '',
      nickname: '단디',
      thumbnail:
        'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
      title: '시고르자브종',
      content: `일기내용입니다.\n일기내용입니다.\n세 번째 줄까지만 보입니다다다다다다다다다다다다다다다다다다다다\n4줄부터 안보입니다!!\n`,
      keywords: ['키워드1', '키워드2', '키워드3', '키워드4'],
      reactionCount: 10,
    },
  ];

  const formatDateString = (str: string) => {
    const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const DateObject = new Date(str);
    const year = DateObject.getFullYear();
    const month = DateObject.getMonth() + 1;
    const day = DateObject.getDate();
    const date = DateObject.getDay();

    return `${year}년 ${month}월 ${day}일 ${week[date]}`;
  };

  return (
    <div className="flex justify-center">
      <div className="border-brown mb-3 rounded-2xl border-2 border-solid bg-[white] p-3">
        <ProfileItem img={''} nickName="종현" />
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold text-[black]">{diaryData[0].title}</p>
          <p className="text-sm font-medium text-[black]">
            {formatDateString(diaryData[0].createdAt)}
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-start">
            <img className="mb-[23px] w-[100%]" src={diaryData[0].thumbnail} alt="기본 이미지" />
          </div>
          <div className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm font-medium text-[black]">
            <p>{diaryData[0].content}</p>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-3 text-base text-[black]">
          {diaryData[0].keywords.map((keyword, index) => (
            <div key={index} className="bg-mint rounded-lg px-3 py-1">
              <p>#{keyword}</p>
            </div>
          ))}
        </div>
        <Reaction count={diaryData[0].reactionCount} />
      </div>
    </div>
  );
};

export default DiaryContent;
