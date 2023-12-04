import NavBar from '@components/Common/NavBar';
import DiaryList from '@components/Common/DiaryList';

import { FEED } from '@util/constants';

const Feed = () => {
  const dummyData = [
    {
      createdAt: '2023-11-13T13:50:17.106Z',
      profileImage:
        'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
      nickname: '단디',
      thumbnail:
        'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
      title: '시고르자브종',
      content: `일기내용입니다.\n일기내용입니다.\n세 번째 줄까지만 보입니다다다다다다다다다다다다다다다다다다다다\n4줄부터 안보입니다!!\n`,
      tags: ['키워드1', '키워드2', '키워드3', '키워드4'],
      reactionCount: 10,
      diaryId: 1,
      authorId: 1,
      emotion: '😀',
    },
  ];

  return (
    <div className="mb-28 flex flex-col items-center justify-start">
      <NavBar />
      <DiaryList pageType={FEED} diaryData={dummyData} />
    </div>
  );
};

export default Feed;
