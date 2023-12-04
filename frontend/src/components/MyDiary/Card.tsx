import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Keyword from '@components/Common/Keyword';
import Reaction from '@components/Common/Reaction';
import ReactionList from '@components/Diary/ReactionList';
import Modal from '@components/Common/Modal';

import { formatDateString } from '@util/funcs';
import { SMALL } from '@util/constants';

interface CardProps {
  data: IDiaryContent;
  styles?: string;
  size?: 'default' | 'small';
}

const Card = ({ data, styles, size }: CardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const toggleShowModal = () => setShowModal((prev) => !prev);
  const toggleShowEmojiPicker = () => {
    if (selectedEmoji === '') {
      setShowEmojiPicker((prev) => !prev);
    } else {
      setSelectedEmoji('');
    }
  };

  const onClickEmoji = (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    toggleShowEmojiPicker();
  };

  return (
    <div
      className={`border-brown relative flex flex-col gap-3 rounded-xl border border-solid px-7 py-6 ${styles}`}
    >
      <p className={`${size === SMALL ? 'text-sm' : ''}`}>{formatDateString(data.createdAt)}</p>
      <h3 className="text-xl font-bold">{data.title}</h3>
      <img src={data.thumbnail} alt="일기의 대표 이미지" />
      <div className="whitespace-pre-wrap text-sm">
        <p>{data.content}</p>
      </div>
      <div className="flex w-full flex-wrap gap-3">
        {data.keywords.map((keyword, index) => (
          <Keyword key={index} text={keyword} styles={`${size === SMALL ? 'text-xs' : ''}`} />
        ))}
      </div>

      <Reaction
        count={data.reactionCount}
        textOnClick={toggleShowModal}
        iconOnClick={toggleShowEmojiPicker}
        emoji={selectedEmoji}
        styles={`${size === SMALL ? 'text-sm' : ''}`}
      />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList diaryId={Number(data.diaryId)} />
      </Modal>
      {showEmojiPicker && (
        <aside className="absolute bottom-14 z-50">
          <EmojiPicker onEmojiClick={onClickEmoji} />
        </aside>
      )}
    </div>
  );
};

export default Card;
