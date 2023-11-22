import { useState } from 'react';
import Keyword from '../Common/Keyword';
import Reaction from '../Common/Reaction';
import ReactionList from '../Diary/ReactionList';
import Modal from '../Common/Modal';
import { IDiaryContent } from '@/types/components/Common/DiaryList';
import { formatDate } from '@/util/funcs';

const Card = (data: IDiaryContent) => {
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal((prev) => !prev);
  return (
    <div className="border-brown flex flex-col gap-5 rounded-xl border border-solid p-7">
      <p>{formatDate(new Date(data.createdAt), 'kor')}</p>
      <h3 className="text-xl font-bold">{data.title}</h3>
      <img src={data.thumbnail} />
      <div className="whitespace-pre-wrap text-sm">
        <p>{data.content}</p>
      </div>
      <div className="flex gap-3">
        {data.keywords.map((keyword, index) => (
          <Keyword key={index} text={keyword} />
        ))}
      </div>

      <Reaction count={0} onClick={toggleShowModal} />
      <Modal showModal={showModal} closeModal={toggleShowModal}>
        <ReactionList />
      </Modal>
    </div>
  );
};

export default Card;
