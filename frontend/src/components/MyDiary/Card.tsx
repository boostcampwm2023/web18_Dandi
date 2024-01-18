import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Keyword from '@components/Common/Keyword';
import Reaction from '@components/Common/Reaction';
import ReactionList from '@components/Diary/ReactionList';

import useModal from '@hooks/useModal';
import usePostReactionMutation from '@hooks/usePostReactionMutation';
import useDeleteReactionMutation from '@hooks/useDeleteReactionMutation';

import { formatDateString } from '@util/funcs';
import { PAGE_URL, SMALL } from '@util/constants';

interface CardProps {
  diaryItem: IDiaryContent;
  styles?: string;
  size?: 'default' | 'small';
}

const Card = ({ diaryItem, styles, size }: CardProps) => {
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(diaryItem.leavedReaction);
  const [totalReaction, setTotalReaction] = useState(diaryItem.reactionCount);
  const { openModal } = useModal();

  const userId = localStorage.getItem('userId') as string;

  const postReactionMutation = usePostReactionMutation(
    Number(userId),
    Number(diaryItem.diaryId),
    selectedEmoji,
  );

  const deleteReactionMutation = useDeleteReactionMutation(
    Number(userId),
    Number(diaryItem.diaryId),
    selectedEmoji,
  );

  const handleDeleteReaction = async () => {
    await deleteReactionMutation.mutate();
    setTotalReaction(totalReaction - 1);
    setSelectedEmoji('');
  };
  const toggleShowEmojiPicker = () => {
    if (!selectedEmoji) {
      setShowEmojiPicker((prev) => !prev);
    } else {
      handleDeleteReaction();
    }
  };

  const onClickEmoji = async (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    await postReactionMutation.mutate();
    setTotalReaction(totalReaction + 1);
    toggleShowEmojiPicker();
  };

  const goDetail = () => navigate(`${PAGE_URL.DETAIL}/${diaryItem.diaryId}`);

  return (
    <div
      className={`border-brown relative flex flex-col gap-3 rounded-xl border border-solid bg-white px-7 py-6 ${styles}`}
    >
      <div onClick={goDetail} className="flex cursor-pointer flex-col gap-2">
        <p className={`${size === SMALL ? 'text-sm' : ''}`}>
          {formatDateString(diaryItem.createdAt)}
        </p>
        <h3 className="text-xl font-bold">{diaryItem.title}</h3>
        {diaryItem.thumbnail && <img src={diaryItem.thumbnail} alt="일기의 대표 이미지" />}
        <div className="whitespace-pre-wrap text-sm">
          <p>{diaryItem.summary}</p>
        </div>
      </div>
      <div className="flex w-full flex-wrap gap-3">
        {diaryItem.tags.map((keyword, index) => (
          <Keyword key={index} text={keyword} styles={`${size === SMALL ? 'text-xs' : ''}`} />
        ))}
      </div>
      <Reaction
        count={totalReaction}
        textOnClick={() =>
          openModal({ children: <ReactionList diaryId={Number(diaryItem.diaryId)} /> })
        }
        iconOnClick={toggleShowEmojiPicker}
        emoji={selectedEmoji}
        styles={`${size === SMALL ? 'text-sm' : ''}`}
      />
      {showEmojiPicker && (
        <aside className="absolute left-14 top-1/3 z-50">
          <EmojiPicker onEmojiClick={onClickEmoji} />
        </aside>
      )}
    </div>
  );
};

export default Card;
