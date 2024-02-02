import { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Parser from 'html-react-parser';

import { IReactionedFriends } from '@type/components/Common/ReactionList';

import ProfileItem from '@components/Common/ProfileItem';
import Reaction from '@components/Common/Reaction';
import Keyword from '@components/Common/Keyword';
import ReactionList from '@components/Diary/ReactionList';

import useUserStore from '@store/useUserStore';

import useModal from '@hooks/useModal';
import useReactionListQuery from '@hooks/useReactionListQuery';
import usePostReactionMutation from '@hooks/usePostReactionMutation';
import useDeleteReactionMutation from '@hooks/useDeleteReactionMutation';

import { formatDateString } from '@util/funcs';

interface DiaryContentProps {
  diaryId: number;
  userId: number;
  createdAt: string;
  profileImage: string;
  authorName: string;
  title: string;
  content: string;
  tagNames: string[];
  reactionCount: number;
}

const DiaryContent = ({
  diaryId,
  userId,
  createdAt,
  profileImage,
  authorName,
  title,
  content,
  tagNames,
  reactionCount,
}: DiaryContentProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [totalReaction, setTotalReaction] = useState(reactionCount);
  const { openModal } = useModal();

  const { data, isError, isSuccess } = useReactionListQuery(diaryId);

  if (isError) {
    return <p>Error fetching data</p>;
  }

  const postReactionMutation = usePostReactionMutation(userId, diaryId, selectedEmoji);

  const deleteReactionMutation = useDeleteReactionMutation(userId, diaryId, selectedEmoji);

  const handleDeleteReaction = async () => {
    await deleteReactionMutation.mutate();
    setTotalReaction(totalReaction - 1);
    setSelectedEmoji('');
  };

  const toggleShowEmojiPicker = () => {
    if (selectedEmoji === '') {
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

  useEffect(() => {
    if (isSuccess) {
      const myData = data.reactionList.find(
        (item: IReactionedFriends) => item.userId === useUserStore().userId,
      );
      if (myData) setSelectedEmoji(myData?.reaction);
      setTotalReaction(data.reactionList.length);
    }
  }, [data]);

  return (
    <>
      <div className="border-brown relative flex flex-col gap-4 rounded-2xl border border-solid bg-white px-7 py-6 sm:mb-3">
        <ProfileItem id={userId} img={profileImage} nickName={authorName} />
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm font-medium">{formatDateString(createdAt)}</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="whitespace-pre-wrap text-sm font-medium">
            <div>{Parser(content)}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-base">
          {tagNames.map((tag, index) => (
            <Keyword key={index} text={tag} />
          ))}
        </div>
        <Reaction
          count={totalReaction}
          textOnClick={() => openModal({ children: <ReactionList diaryId={diaryId} /> })}
          iconOnClick={toggleShowEmojiPicker}
          emoji={selectedEmoji}
        />
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
