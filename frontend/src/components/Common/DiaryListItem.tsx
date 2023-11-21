import Reaction from '@components/Common/Reaction';
import ProfileItem from '@components/Common/ProfileItem';
import Modal from '@components/Common/Modal';
import ReactionList from '@components/Diary/ReactionList';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DiaryListProps {
  createdAt: string;
  profileImage: string;
  nickname: string;
  thumbnail: string;
  title: string;
  content: string;
  keywords: string[];
  reactionCount: number;
  pageType: string;
  authorId: string | number;
  diaryId: string | number;
}

const DiaryListItem = (props: DiaryListProps) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  const goDetail = () => navigate(`/detail/${props.diaryId}`);
  const goFriendHome = () => navigate(`/home/${props.authorId}`);

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
    <div className="border-brown mb-3 rounded-2xl border border-solid bg-[white] p-3">
      {props.pageType === 'feed' && (
        <div className="mb-3 cursor-pointer" onClick={goFriendHome}>
          <ProfileItem img={props.profileImage} nickName={props.nickname} />
        </div>
      )}

      <div className="cursor-pointer" onClick={goDetail}>
        <header className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold text-[black]">{props.title}</p>
          <p className="text-sm font-medium text-[black]">{formatDateString(props.createdAt)}</p>
        </header>

        <main className="flex flex-col justify-center">
          <div className="flex justify-start">
            <img className="mb-[23px] w-[100%]" src={props.thumbnail} alt="기본 이미지" />
          </div>
          <div className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm font-medium text-[black]">
            <p>{props.content}</p>
          </div>
        </main>
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-base text-[black]">
        {props.keywords.map((keyword, index) => (
          <div key={index} className="bg-mint rounded-lg px-3 py-1">
            <p>#{keyword}</p>
          </div>
        ))}
      </div>

      <Reaction count={props.reactionCount} onClick={toggleShowModal} />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList />
      </Modal>
    </div>
  );
};

export default DiaryListItem;
