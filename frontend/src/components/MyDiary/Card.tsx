import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { getReactionList, postReaction, deleteReaction } from '@api/Reaction';
import { IDiaryContent } from '@type/components/Common/DiaryList';
import { IReactionedFriends } from '@type/components/Common/ReactionList';
import Keyword from '@components/Common/Keyword';
import Reaction from '@components/Common/Reaction';
import ReactionList from '@components/Diary/ReactionList';
import Modal from '@components/Common/Modal';

import { formatDateString } from '@util/funcs';
import { SMALL } from '@util/constants';

interface CardProps {
  diaryItem: IDiaryContent;
  styles?: string;
  size?: 'default' | 'small';
}

const Card = ({ diaryItem, styles, size }: CardProps) => {
  const params = useParams();
  const userId = params.userId ? params.userId : localStorage.getItem('userId');
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [totalReaction, setTotalReaction] = useState(diaryItem.reactionCount);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['reactionList', diaryItem.diaryId],
    queryFn: () => getReactionList(Number(diaryItem.diaryId)),
  });

  if (isError) {
    return <p>Error fetching data</p>;
  }

  useEffect(() => {
    if (isSuccess) {
      const myData = data.reactionList.find(
        (item: IReactionedFriends) => item.userId === Number(userId),
      );
      myData && setSelectedEmoji(myData?.reaction);
      setTotalReaction(data.reactionList.length);
    }
  }, [isSuccess]);

  const postReactionMutation = useMutation({
    mutationFn: () => postReaction(Number(diaryItem.diaryId), selectedEmoji),
  });

  const deleteReactionMutation = useMutation({
    mutationFn: () => deleteReaction(Number(diaryItem.diaryId), selectedEmoji),
  });

  const handleDeleteReaction = async () => {
    await deleteReactionMutation.mutate();
    setTotalReaction(totalReaction - 1);
    setSelectedEmoji('');
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);
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
        {diaryItem.keywords.map((keyword, index) => (
          <Keyword key={index} text={keyword} styles={`${size === SMALL ? 'text-xs' : ''}`} />
        ))}
      </div>

      <Reaction
        count={totalReaction}
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
