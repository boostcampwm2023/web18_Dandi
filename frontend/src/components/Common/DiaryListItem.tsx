import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Reaction from '@components/Common/Reaction';
import ProfileItem from '@components/Common/ProfileItem';
import Modal from '@components/Common/Modal';
import ReactionList from '@components/Diary/ReactionList';
import Keyword from '@components/Common/Keyword';

import { FEED } from '@util/constants';
import { formatDateString } from '@util/funcs';

interface DiaryListItemProps {
  pageType?: string;
  diaryItem: IDiaryContent;
}

const DiaryListItem = ({ pageType, diaryItem }: DiaryListItemProps) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const toggleShowModal = () => setShowModal((prev) => !prev);
  const toggleShowEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const goDetail = () => navigate(`/detail/${diaryItem.diaryId}`);
  const goFriendHome = () => navigate(`/home/${diaryItem.authorId}`);

  const onClickEmoji = (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    toggleShowEmojiPicker();
  };

  return (
    <div className="border-brown relative mb-3 rounded-2xl border border-solid bg-white px-7 py-6">
      {pageType === FEED && (
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
            <img className="mb-6 w-full" src={diaryItem.thumbnail} alt="기본 이미지" />
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

      <Reaction
        count={diaryItem.reactionCount}
        iconOnClick={toggleShowEmojiPicker}
        textOnClick={toggleShowModal}
        emoji={selectedEmoji}
      />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList />
      </Modal>
      {showEmojiPicker && (
        <aside className="absolute bottom-14 z-50">
          <EmojiPicker onEmojiClick={onClickEmoji} />
        </aside>
      )}
    </div>
  );
};

export default DiaryListItem;
