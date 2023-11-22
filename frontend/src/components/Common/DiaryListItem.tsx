import Reaction from '@components/Common/Reaction';
import ProfileItem from '@components/Common/ProfileItem';
import Modal from '@components/Common/Modal';
import ReactionList from '@components/Diary/ReactionList';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDiaryContent } from '@type/components/Common/DiaryList';
import Keyword from './Keyword';

interface DiaryListItemProps {
  pageType?: string;
  diaryItem: IDiaryContent;
}

const DiaryListItem = ({ pageType, diaryItem }: DiaryListItemProps) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal((prev) => !prev);

  const goDetail = () => navigate(`/detail/${diaryItem.diaryId}`);
  const goFriendHome = () => navigate(`/home/${diaryItem.authorId}`);

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
    <div className="border-brown mb-3 rounded-2xl border border-solid bg-white p-3">
      {pageType === 'feed' && (
        <div className="mb-3 cursor-pointer" onClick={goFriendHome}>
          <ProfileItem img={diaryItem.profileImage} nickName={diaryItem.nickname} />
        </div>
      )}

      <div className="cursor-pointer" onClick={goDetail}>
        <header className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold">{diaryItem.title}</p>
          <p className="text-sm font-medium">{formatDateString(diaryItem.createdAt)}</p>
        </header>

        <main className="flex flex-col justify-center">
          <div className="flex justify-start">
            <img className="mb-6 w-[100%]" src={diaryItem.thumbnail} alt="기본 이미지" />
          </div>
          <div className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm font-medium">
            <p>{diaryItem.content}</p>
          </div>
        </main>
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-base">
        {diaryItem.keywords.map((keyword, index) => (
          <Keyword key={index} text={keyword} />
        ))}
      </div>

      <Reaction count={diaryItem.reactionCount} onClick={toggleShowModal} />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList />
      </Modal>
    </div>
  );
};

export default DiaryListItem;
