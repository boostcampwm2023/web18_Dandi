import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import { getReactionList, postReaction, deleteReaction } from '@api/Reaction';

import { IDiaryContent } from '@type/components/Common/DiaryList';
import { IReactionedFriends } from '@type/components/Common/ReactionList';

import Reaction from '@components/Common/Reaction';
import ProfileItem from '@components/Common/ProfileItem';
import Modal from '@components/Common/Modal';
import ReactionList from '@components/Diary/ReactionList';
import Keyword from '@components/Common/Keyword';

import { FEED } from '@util/constants';
import { formatDateString } from '@util/funcs';

interface DiaryListItemProps {
  pageType?: string;
  diaryItem: IDiaryContent;
}

const DiaryListItem = ({ pageType, diaryItem }: DiaryListItemProps) => {
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

  const goDetail = () => navigate(`/detail/${diaryItem.diaryId}`);
  const goFriendHome = () => navigate(`/home/${diaryItem.authorId}`);

  const onClickEmoji = async (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    await postReactionMutation.mutate();
    setTotalReaction(totalReaction + 1);
    toggleShowEmojiPicker();
  };

  return (
    <div className="border-brown relative mb-3 rounded-2xl border border-solid bg-white px-7 py-6">
      {pageType === FEED && (
        <div className="mb-3 cursor-pointer" onClick={goFriendHome}>
          <ProfileItem
            id={Number(diaryItem.authorId)}
            img={diaryItem.profileImage}
            nickName={diaryItem.nickname}
          />
        </div>
      )}

      <div className="cursor-pointer" onClick={goDetail}>
        <header className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold">{diaryItem.title}</p>
          <p className="text-sm font-medium">{formatDateString(diaryItem.createdAt)}</p>
        </header>

        <main className="flex flex-col justify-center">
          <div className="flex justify-start">
            {diaryItem.thumbnail && (
              <img className="mb-6 w-full" src={diaryItem.thumbnail} alt="기본 이미지" />
            )}
          </div>
          <div className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm font-medium">
            <p>{diaryItem.summary}</p>
          </div>
        </main>
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-base">
        {Array.from(diaryItem.tags).map((keyword, index) => (
          <Keyword key={index} text={keyword} />
        ))}
      </div>

      <Reaction
        count={totalReaction}
        iconOnClick={toggleShowEmojiPicker}
        textOnClick={toggleShowModal}
        emoji={selectedEmoji}
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

export default DiaryListItem;
