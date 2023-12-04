import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EmojiPicker from 'emoji-picker-react';
import Parser from 'html-react-parser';
import { getReactionList, postReaction, deleteReaction } from '@api/Reaction';
import { IReactionedFriends } from '@type/components/Common/ReactionList';
import ProfileItem from '@components/Common/ProfileItem';
import Reaction from '@components/Common/Reaction';
import Modal from '@components/Common/Modal';
import Keyword from '@components/Common/Keyword';
import ReactionList from '@components/Diary/ReactionList';

import { formatDateString } from '@util/funcs';

interface DiaryContentProps {
  diaryId: number;
  userId: number;
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
  userId,
  createdAt,
  profileImage,
  authorName,
  title,
  content,
  tags,
  reactionCount,
}: DiaryContentProps) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [totalReaction, setTotalReaction] = useState(reactionCount);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['reactionList', diaryId],
    queryFn: () => getReactionList(diaryId),
  });

  if (isError) {
    return <p>Error fetching data</p>;
  }

  useEffect(() => {
    if (isSuccess) {
      const myData = data.reactionList.find((item: IReactionedFriends) => item.userId === userId);
      myData && setSelectedEmoji(myData?.reaction);
      setTotalReaction(data.reactionList.length);
    }
  }, [isSuccess]);

  const postReactionMutation = useMutation({
    mutationFn: () => postReaction(diaryId, selectedEmoji),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reactionList', diaryId],
        refetchType: 'active',
      });
    },
  });

  const deleteReactionMutation = useMutation({
    mutationFn: () => deleteReaction(diaryId, selectedEmoji),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reactionList', diaryId],
        refetchType: 'active',
      });
    },
  });

  const handleDeleteReaction = async () => {
    await deleteReactionMutation.mutate();
    setTotalReaction(totalReaction - 1);
    setSelectedEmoji('');
  };

  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
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

  return (
    <>
      <div className="border-brown relative mb-3 rounded-2xl border-2 border-solid bg-white p-3">
        <ProfileItem id={userId} img={profileImage} nickName={authorName} />
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm font-medium">{formatDateString(createdAt)}</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-3  whitespace-pre-wrap text-sm font-medium">
            <div>{Parser(content)}</div>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-3 text-base">
          {tags.map((tag, index) => (
            <Keyword key={index} text={tag} />
          ))}
        </div>
        <Reaction
          count={totalReaction}
          textOnClick={toggleShowModal}
          iconOnClick={toggleShowEmojiPicker}
          emoji={selectedEmoji}
        />
        <Modal showModal={showModal} closeModal={toggleShowModal}>
          <ReactionList diaryId={diaryId} />
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
