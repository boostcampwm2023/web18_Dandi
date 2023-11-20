import { useState } from 'react';
import emojiIcon from '@assets/image/reactionEmoji.svg';
import Modal from './Modal';

interface ReactionProps {
  count: number;
}

const Reaction = ({ count }: ReactionProps) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-start" onClick={openModal}>
        <img src={emojiIcon} alt="리액션 아이콘" />
        <p className="color text-default text-base font-bold">친구들의 반응 {count}개</p>
      </div>
      <Modal showModal={showModal} closeModal={closeModal}>
        <div>친구들의 반응</div>
      </Modal>
    </div>
  );
};

export default Reaction;
