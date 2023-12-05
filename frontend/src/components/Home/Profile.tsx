import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteFriend, requestFriend } from '@/api/FriendModal';

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
  PAGE_URL,
} from '@util/constants';

interface ProfileProps {
  userId: number;
  userData: ProfileData;
}

interface ProfileData {
  nickname: string;
  profileImage: string;
  totalFriends: number;
  isExistedTodayDiary: boolean;
  relation: null | relationData;
}

interface relationData {
  status: 'complete' | 'waiting';
  senderId: number;
  receiverId: number;
}

const Profile = ({ userId, userData }: ProfileProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isFriendHome = useParams().userId ?? false;

  const [showModalType, setShowModalType] = useState('list');
  const [showModal, setShowModal] = useState(false);

  const { nickname, profileImage, totalFriends, isExistedTodayDiary, relation }: ProfileData =
    userData;
  const targetPage = isExistedTodayDiary ? PAGE_URL.MY_DIARY : PAGE_URL.EDIT;

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
        return <FriendList userId={userId} />;
      case PROFILE_MODAL_CONTENT_TYPE.REQUEST:
        return <FriendRequest userId={userId} />;
      case PROFILE_MODAL_CONTENT_TYPE.EDIT:
        return <ProfileEdit profileImage={profileImage} nickname={nickname} />;
    }
  };

  const modalContent = getModalContent(showModalType);

  const getRandomIndex = Math.floor(Math.random() * GREET_MESSAGES.length);

  const requestFriendMutation = useMutation({
    mutationFn: (receiverId: number) => requestFriend(receiverId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['sendList'],
      });
    },
  });

  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: number) => deleteFriend(friendId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['friendList'],
      });
    },
  });

  const getRelationContent = () => {
    if (relation === null) {
      return (
        <p
          onClick={() => {
            requestFriendMutation.mutate(+userId);
          }}
          className="cursor-pointer"
        >
          친구 요청
        </p>
      );
    }

    if (relation.status === 'waiting') {
      return <p>대기 중</p>;
    }

    return (
      <p
        onClick={() => {
          deleteFriendMutation.mutate(+userId);
        }}
        className="cursor-pointer"
      >
        친구 끊기
      </p>
    );
  };

  return (
    <section className="mb-10 flex flex-col items-center justify-center">
      <div className="mb-10 flex flex-row items-center justify-center">
        <img
          className="h-52 w-52 rounded-full object-cover"
          src={profileImage}
          alt="나의 프로필 사진"
        />

        {isFriendHome && (
          <div className="ml-10">
            <p className="mb-8 text-3xl font-bold">{nickname}</p>
            <div className="border-brown grid w-max grid-flow-col rounded-2xl border-2 border-solid p-5 text-center text-lg font-bold">
              <p
                className="cursor-pointer"
                onClick={() => onClickButton(PROFILE_MODAL_CONTENT_TYPE.LIST)}
              >
                친구 {totalFriends}명
              </p>
              <div className="border-brown mx-5 border-l-2 border-solid" />
              {getRelationContent()}
            </div>
          </div>
        )}

        {!isFriendHome && (
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
        )}
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
        onClick={() => navigate(targetPage)}
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
