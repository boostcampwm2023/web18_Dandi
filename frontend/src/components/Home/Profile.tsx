import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@api/Profile';

import Button from '@components/Common/Button';
import Modal from '@components/Common/Modal';
import FriendList from '@components/Home/FriendList';
import FriendRequest from '@components/Home/FriendRequest';
import ProfileEdit from '@components/Home/ProfileEdit';
import {
  DEFAULT,
  GREET_MESSAGES,
  PROFILE_MODAL_CONTENT_TYPE,
  TEXT_ABOUT_EXISTED_TODAY,
  LARGE,
} from '@util/constants';

interface ProfileProps {
  userId: number;
  nickname: string;
  profileImage: string;
  totalFriends: number;
  isExistedTodayDiary: boolean;
}

const Profile = ({ userId }: ProfileProps) => {
  const [showModalType, setShowModalType] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const { data, isError, isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: () => getCurrentUser(userId),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error Occurrence!</p>;
  }

  const { nickname, profileImage, totalFriends, isExistedTodayDiary }: ProfileProps = data;

  const closeModal = () => {
    setShowModal(false);
  };

  const onClickButton = (type: string) => {
    setShowModal(true);
    setShowModalType(type);
  };

  const getModalContent = (type: string) => {
    switch (type) {
      case PROFILE_MODAL_CONTENT_TYPE.LIST:
        return <FriendList />;
      case PROFILE_MODAL_CONTENT_TYPE.REQUEST:
        return <FriendRequest />;
      case PROFILE_MODAL_CONTENT_TYPE.EDIT:
        return <ProfileEdit />;
    }
  };

  const modalContent = getModalContent(showModalType);

  const getRandomIndex = Math.floor(Math.random() * GREET_MESSAGES.length);

  return (
    <section className="mb-10 flex flex-col items-center justify-center">
      <div className="mb-10 flex flex-row items-center justify-center">
        <img
          className="h-52 w-52 rounded-full object-cover"
          src={profileImage}
          alt="나의 프로필 사진"
        />
        <div className="ml-10">
          <p className="mb-8 text-3xl font-bold">
            {nickname}님, {GREET_MESSAGES[getRandomIndex]}
          </p>
          <div className="border-brown grid w-max grid-flow-col rounded-2xl border-2 border-solid p-5 text-center text-lg font-bold">
            <p
              className="cursor-pointer"
              onClick={() => onClickButton(PROFILE_MODAL_CONTENT_TYPE.LIST)}
            >
              친구 {totalFriends}명
            </p>
            <div className="border-brown mx-5 border-l-2 border-solid" />
            <p
              className="cursor-pointer"
              onClick={() => onClickButton(PROFILE_MODAL_CONTENT_TYPE.REQUEST)}
            >
              친구 관리
            </p>
            <div className="border-brown mx-5 border-l-2 border-solid" />
            <p
              className="cursor-pointer"
              onClick={() => onClickButton(PROFILE_MODAL_CONTENT_TYPE.EDIT)}
            >
              내 정보 수정
            </p>
          </div>
        </div>
      </div>
      <div className="mb-5 text-center text-2xl font-bold leading-relaxed">
        {TEXT_ABOUT_EXISTED_TODAY[`${isExistedTodayDiary}`]['noticeText'].map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <Button
        text={TEXT_ABOUT_EXISTED_TODAY[`${isExistedTodayDiary}`]['buttonText']}
        type={DEFAULT}
        size={LARGE}
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
