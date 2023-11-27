import { useState } from 'react';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Keyword from '@components/Common/Keyword';
import Reaction from '@components/Common/Reaction';
import ReactionList from '@components/Diary/ReactionList';
import Modal from '@components/Common/Modal';

import { formatDate } from '@util/funcs';
import { SMALL } from '@util/constants';

interface CardProps {
  data: IDiaryContent;
  styles?: string;
  size?: 'default' | 'small';
}

const Card = ({ data, styles, size }: CardProps) => {
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal((prev) => !prev);
  return (
    <div
      className={`border-brown flex flex-col gap-5 rounded-xl border border-solid p-7 ${styles}`}
    >
      <p className={`${size === SMALL ? 'text-sm' : ''}`}>
        {formatDate(new Date(data.createdAt), 'kor')}
      </p>
      <h3 className="text-xl font-bold">{data.title}</h3>
      <img src={data.thumbnail} />
      <div className="whitespace-pre-wrap text-sm">
        <p>{data.content}</p>
      </div>
      <div className="flex w-full flex-wrap gap-3">
        {data.keywords.map((keyword, index) => (
          <Keyword key={index} text={keyword} styles={`${size === SMALL ? 'text-xs' : ''}`} />
        ))}
      </div>

      <Reaction count={0} onClick={toggleShowModal} styles={`${size === SMALL ? 'text-sm' : ''}`} />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList />
      </Modal>
    </div>
  );
};

export default Card;
