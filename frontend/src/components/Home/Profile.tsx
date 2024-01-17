import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteFriend, requestFriend } from '@api/FriendModal';

import Button from '@components/Common/Button';
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
  reactQueryKeys,
} from '@util/constants';

import { useToast } from '@hooks/useToast';
import useModal from '@hooks/useModal';

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
  const openToast = useToast();

  const loginUserId = localStorage.getItem('userId');
  const paramsUserId = useParams().userId ?? false;
  const isFriendHome = loginUserId !== paramsUserId && paramsUserId;

  const { openModal } = useModal();

  const { nickname, profileImage, totalFriends, isExistedTodayDiary, relation }: ProfileData =
    userData;
  const targetPage = isExistedTodayDiary ? PAGE_URL.MY_DIARY : PAGE_URL.EDIT;

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

  const getRandomIndex = Math.floor(Math.random() * GREET_MESSAGES.length);

  const requestFriendMutation = useMutation({
    mutationFn: (receiverId: number) => requestFriend(receiverId),
    onSuccess() {
      openToast('친구 요청을 보냈습니다.');
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [reactQueryKeys.SendList],
        });
        queryClient.invalidateQueries({
          queryKey: [reactQueryKeys.ProfileData],
        });
      }, 100);
    },
  });

  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: number) => deleteFriend(friendId),
    onSuccess() {
      openToast('친구 삭제가 완료되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.FriendList],
      });
      queryClient.invalidateQueries({
        queryKey: [reactQueryKeys.ProfileData],
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
    <section className="flex flex-col items-center justify-center p-1 sm:p-0">
      <div className="my-10 flex flex-col items-center justify-center sm:flex-row">
        <img
          className="border-brown mb-5 h-52 w-52 rounded-full border-2 border-solid object-cover sm:mb-0"
          src={profileImage}
          alt="나의 프로필 사진"
        />

        {isFriendHome && (
          <div className="sm:ml-10">
            <p className="mb-8 text-2xl font-bold sm:text-3xl">{nickname}</p>
            <div className="border-brown grid w-max grid-flow-col rounded-2xl border-2 border-solid bg-white p-5 text-center text-lg font-bold">
              <p
                className="cursor-pointer"
                onClick={() =>
                  openModal({ children: getModalContent(PROFILE_MODAL_CONTENT_TYPE.LIST) })
                }
              >
                친구 {totalFriends}명
              </p>
              <div className="border-brown mx-5 border-l-2 border-solid" />
              {getRelationContent()}
            </div>
          </div>
        )}

        {!isFriendHome && (
          <div className="sm:ml-10">
            <p className="mb-8 text-2xl font-bold sm:text-3xl">
              {nickname}님, {GREET_MESSAGES[getRandomIndex]}
            </p>
            <div className="border-brown grid w-max grid-flow-col rounded-2xl border-2 border-solid bg-white p-5 text-center text-lg font-bold">
              <p
                className="cursor-pointer"
                onClick={() =>
                  openModal({ children: getModalContent(PROFILE_MODAL_CONTENT_TYPE.LIST) })
                }
              >
                친구 {totalFriends}명
              </p>
              <div className="border-brown mx-5 border-l-2 border-solid" />
              <p
                className="cursor-pointer"
                onClick={() =>
                  openModal({ children: getModalContent(PROFILE_MODAL_CONTENT_TYPE.REQUEST) })
                }
              >
                친구 관리
              </p>
              <div className="border-brown mx-5 border-l-2 border-solid" />
              <p
                className="cursor-pointer"
                onClick={() =>
                  openModal({ children: getModalContent(PROFILE_MODAL_CONTENT_TYPE.EDIT) })
                }
              >
                내 정보 수정
              </p>
            </div>
          </div>
        )}
      </div>
      {!isFriendHome && (
        <div className="mb-10 flex w-full flex-1 flex-col items-center">
          <div className="mb-5 text-center text-lg font-bold leading-relaxed sm:text-2xl">
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
        </div>
      )}
    </section>
  );
};

export default Profile;
