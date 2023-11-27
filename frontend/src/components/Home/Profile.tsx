import { useState } from 'react';

import Button from '@components/Common/Button';
import Modal from '@components/Common/Modal';
import FriendList from '@components/Home/FriendList';
import FriendRequest from '@components/Home/FriendRequest';
import ProfileEdit from '@components/Home/ProfileEdit';

interface ProfileProps {
  nickname: string;
  profileImage: string;
  totalFriends: number;
  isExistedTodayDiary: boolean;
}

const Profile = ({ nickname, profileImage, totalFriends, isExistedTodayDiary }: ProfileProps) => {
  const [showModalType, setShowModalType] = useState('list');
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const onClickButton = (type: string) => {
    setShowModal(true);
    setShowModalType(type);
  };

  const getModalContent = (type: string) => {
    switch (type) {
      case 'list':
        return <FriendList />;
      case 'request':
        return <FriendRequest />;
      case 'profileEdit':
        return <ProfileEdit />;
    }
  };

  const modalContent = getModalContent(showModalType);

  const greetMessages = ['좋은 하루예요!', '안녕하세요!', '반가워요!'];
  const getRandomIndex = Math.floor(Math.random() * greetMessages.length);
  const textAboutIsExistedTodayDiary = {
    true: {
      buttonText: '오늘 하루 보러 가기',
      noticeText: ['오늘 일기를 작성하셨네요!', '작성하신 일기를 보여드릴게요.'],
    },
    false: {
      buttonText: '오늘 하루 기록하기',
      noticeText: ['아직 오늘 일기를 작성하지 않으셨네요!', '일기를 작성해볼까요?'],
    },
  };

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
            <p className="cursor-pointer" onClick={() => onClickButton('list')}>
              친구 {totalFriends}명
            </p>
            <div className="border-brown mx-5 border-l-2 border-solid" />
            <p className="cursor-pointer" onClick={() => onClickButton('request')}>
              친구 관리
            </p>
            <div className="border-brown mx-5 border-l-2 border-solid" />
            <p className="cursor-pointer" onClick={() => onClickButton('profileEdit')}>
              내 정보 수정
            </p>
          </div>
        </div>
      </div>
      <div className="text-center text-2xl font-bold leading-relaxed">
        {textAboutIsExistedTodayDiary[`${isExistedTodayDiary}`]['noticeText'].map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <Button
        text={textAboutIsExistedTodayDiary[`${isExistedTodayDiary}`]['buttonText']}
        type="default"
        size='large'
        onClick={() => console.log('일기 쓰기')}
      />
      {showModal && (
        <Modal showModal={showModal} closeModal={closeModal}>
          {modalContent}
        </Modal>
      )}
    </section>
  );
};

export default Profile;
