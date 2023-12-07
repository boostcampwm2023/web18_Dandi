import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { getReactionList, postReaction, deleteReaction } from '@api/Reaction';

import { IDiaryContent } from '@type/components/Common/DiaryList';
import { IReactionedFriends } from '@type/components/Common/ReactionList';

import Keyword from '@components/Common/Keyword';
import Reaction from '@components/Common/Reaction';
import ReactionList from '@components/Diary/ReactionList';
import Modal from '@components/Common/Modal';

import { formatDateString } from '@util/funcs';
import { PAGE_URL, SMALL } from '@util/constants';

interface CardProps {
  diaryItem: IDiaryContent;
  styles?: string;
  size?: 'default' | 'small';
}

const Card = ({ diaryItem, styles, size }: CardProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
        textOnClick={toggleShowModal}
        iconOnClick={toggleShowEmojiPicker}
        emoji={selectedEmoji}
        styles={`${size === SMALL ? 'text-sm' : ''}`}
      />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList diaryId={Number(diaryItem.diaryId)} />
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
