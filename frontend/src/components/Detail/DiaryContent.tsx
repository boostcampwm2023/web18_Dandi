import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Parser from 'html-react-parser';

import ProfileItem from '@components/Common/ProfileItem';
import Reaction from '@components/Common/Reaction';
import Modal from '@components/Common/Modal';
import Keyword from '@components/Common/Keyword';
import ReactionList from '@components/Diary/ReactionList';

import { formatDateString } from '@util/funcs';

interface DiaryContentProps {
  diaryId: number;
  createdAt: string;
  profileImage: string;
  authorName: string;
  title: string;
  content: string;
  tags: string[];
  reactionCount: number;
}

const DiaryContent = ({
  diaryId,
  createdAt,
  profileImage,
  authorName,
  title,
  content,
  tags,
  reactionCount,
}: DiaryContentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
  };
  const toggleShowEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const onClickEmoji = (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    toggleShowEmojiPicker();
  };

  return (
    <>
      <div className="border-brown relative mb-3 rounded-2xl border-2 border-solid bg-white p-3">
        <ProfileItem img={profileImage} nickName={authorName} />
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm font-medium">{formatDateString(createdAt)}</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-3  whitespace-pre-wrap text-sm font-medium">
            <p>{Parser(content)}</p>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-3 text-base">
          {tags.map((tag, index) => (
            <Keyword key={index} text={tag} />
          ))}
        </div>
        <Reaction
          count={reactionCount}
          textOnClick={toggleShowModal}
          iconOnClick={toggleShowEmojiPicker}
          emoji={selectedEmoji}
        />
        <Modal showModal={showModal} closeModal={toggleShowModal}>
          <ReactionList diaryId={diaryId}/>
        </Modal>
        {showEmojiPicker && (
          <aside className="absolute bottom-14 z-50">
            <EmojiPicker onEmojiClick={onClickEmoji} />
          </aside>
        )}
      </div>
    </>
  );
};

export default DiaryContent;
