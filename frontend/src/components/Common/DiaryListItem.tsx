import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { postReaction, deleteReaction } from '@api/Reaction';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Reaction from '@components/Common/Reaction';
import ProfileItem from '@components/Common/ProfileItem';
import Modal from '@components/Common/Modal';
import ReactionList from '@components/Diary/ReactionList';
import Keyword from '@components/Common/Keyword';

import { FEED, PAGE_URL } from '@util/constants';
import { formatDateString } from '@util/funcs';

import useModal from '@hooks/useModal';

interface DiaryListItemProps {
  pageType?: string;
  diaryItem: IDiaryContent;
}

const DiaryListItem = ({ pageType, diaryItem }: DiaryListItemProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(diaryItem.leavedReaction);
  const [totalReaction, setTotalReaction] = useState(diaryItem.reactionCount);
  const { openModal } = useModal();

  const postReactionMutation = useMutation({
    mutationFn: () => postReaction(Number(diaryItem.diaryId), selectedEmoji),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reactionList', diaryItem.diaryId],
        refetchType: 'active',
      });
    },
  });

  const deleteReactionMutation = useMutation({
    mutationFn: () => deleteReaction(Number(diaryItem.diaryId), selectedEmoji),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reactionList', diaryItem.diaryId],
        refetchType: 'active',
      });
    },
  });

  const handleDeleteReaction = () => {
    deleteReactionMutation.mutate();
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

  const onClickEmoji = (emojiData: any) => {
    postReactionMutation.mutate();
    setSelectedEmoji(emojiData.emoji);
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
          openModal({ children: <ReactionList diaryId={Number(diaryItem.diaryId)} /> })
        }
        emoji={selectedEmoji}
      />
      <Modal />
      {showEmojiPicker && (
        <aside className="absolute bottom-14 z-50">
          <EmojiPicker onEmojiClick={onClickEmoji} />
        </aside>
      )}
    </div>
  );
};

export default DiaryListItem;
