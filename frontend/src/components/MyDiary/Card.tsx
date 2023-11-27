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
  const toggleShowEmojiPicker = () => setShowEmojiPicker((prev) => !prev);
  const onClickEmoji = (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    toggleShowEmojiPicker();
  };

  return (
    <div className={`border-brown relative rounded-xl border border-solid px-7 py-6 ${styles}`}>
      <p className={`${size === SMALL ? 'text-sm' : ''} mb-3`}>
        {formatDateString(data.createdAt)}
      </p>
      <h3 className="mb-3 text-xl font-bold">{data.title}</h3>
      <img src={data.thumbnail} className="mb-3" alt="일기의 대표 이미지" />
      <div className="mb-3 whitespace-pre-wrap text-sm">
        <p>{data.content}</p>
      </div>
      <div className="mb-4 flex w-full flex-wrap gap-3">
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
        <ReactionList />
      </Modal>
      {showEmojiPicker && (
        <aside className="absolute z-50 mt-2">
          <EmojiPicker onEmojiClick={onClickEmoji} />
        </aside>
      )}
    </div>
  );
};

export default Card;
