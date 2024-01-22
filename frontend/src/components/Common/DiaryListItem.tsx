import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Reaction from '@components/Common/Reaction';
import ProfileItem from '@components/Common/ProfileItem';
import ReactionList from '@components/Diary/ReactionList';
import Keyword from '@components/Common/Keyword';

import useModal from '@hooks/useModal';
import usePostReactionMutation from '@hooks/usePostReactionMutation';
import useDeleteReactionMutation from '@hooks/useDeleteReactionMutation';

import { FEED, PAGE_URL } from '@util/constants';
import { formatDateString } from '@util/funcs';

interface DiaryListItemProps {
  pageType?: string;
  diaryItem: IDiaryContent;
}

const DiaryListItem = ({ pageType, diaryItem }: DiaryListItemProps) => {
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [totalReaction, setTotalReaction] = useState(0);
  const { isOpen, openModal } = useModal();

  const userId = localStorage.getItem('userId') as string;

  useEffect(() => {
    setSelectedEmoji(diaryItem.leavedReaction);
    setTotalReaction(diaryItem.reactionCount);
  }, [diaryItem]);

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
    setSelectedEmoji('');
    setTotalReaction((prev) => prev - 1);
  };
  const toggleShowEmojiPicker = () => {
    if (!selectedEmoji) {
      setShowEmojiPicker((prev) => !prev);
    } else {
      handleDeleteReaction();
    }
  };

  const goDetail = () => navigate(`${PAGE_URL.DETAIL}/${diaryItem.diaryId}`);
  const goFriendHome = () => navigate(`${PAGE_URL.HOME}${diaryItem.authorId}`);

  const onClickEmoji = async (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    await postReactionMutation.mutate();
    toggleShowEmojiPicker();
    setTotalReaction((prev) => prev + 1);
  };

  return (
    <div className="border-brown relative mb-3 flex flex-col gap-4 rounded-2xl border border-solid bg-white px-7 py-6">
      {pageType === FEED && (
        <div className="cursor-pointer" onClick={goFriendHome}>
          <ProfileItem
            id={Number(diaryItem.authorId)}
            img={diaryItem.profileImage}
            nickName={diaryItem.nickname}
          />
        </div>
      )}
      <div className="flex cursor-pointer flex-col gap-4" onClick={goDetail}>
        <header className="flex flex-col justify-between sm:flex-row">
          <p className="text-lg font-bold">{diaryItem.title}</p>
          <p className="hidden text-sm  font-medium sm:block">
            {formatDateString(diaryItem.createdAt)}
          </p>
        </header>

        <main className="flex flex-col justify-center">
          {diaryItem.thumbnail && (
            <img
              className="mb-6 w-full object-cover lg:h-80"
              src={diaryItem.thumbnail}
              alt="기본 이미지"
            />
          )}
          <div className="line-clamp-3 whitespace-pre-wrap text-sm font-medium">
            <p>{diaryItem.summary}</p>
          </div>
        </main>
      </div>

      <div className="flex flex-wrap gap-3 text-base">
        {diaryItem.tags.map((keyword, index) => (
          <Keyword key={index} text={keyword} />
        ))}
      </div>

      <Reaction
        count={totalReaction}
        iconOnClick={toggleShowEmojiPicker}
        textOnClick={() =>
          !isOpen &&
          openModal({
            children: <ReactionList diaryId={Number(diaryItem.diaryId)} />,
          })
        }
        emoji={selectedEmoji}
      />
      {showEmojiPicker && (
        <aside className="absolute bottom-14 z-50">
          <EmojiPicker onEmojiClick={onClickEmoji} />
        </aside>
      )}
    </div>
  );
};

export default DiaryListItem;
