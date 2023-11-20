import { useState } from 'react';
import NavBar from '@components/Common/NavBar';
import Button from '@components/Common/Button';
import Modal from '@components/Common/Modal';
import DiaryContent from '@components/Detail/DiaryContent';
import Alert from '@components/Common/Alert';

const Detail = () => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const diaryData = {
    createdAt: '2023-11-13T13:50:17.106Z',
    profileImage: '',
    authorName: '종현',
    nickname: '단디',
    title: '시고르자브종',
    content: `일기내용입니다.\n일기내용입니다.\n다다다다다다다다다다다다다다다다다다다다\n다다다다다다다다다다다다다다다다다다다다\n다다다다다다다다다다다다다다다다다다다다\n\n`,
    keywords: ['키워드1', '키워드2', '키워드3', '키워드4'],
    reactionCount: 10,
  };
  const content = <DiaryContent {...diaryData} />;

  return (
    <div className="flex flex-col items-center">
      <NavBar />
      <div className="flex w-2/3 flex-col gap-2">
        <div className="flex justify-end gap-2">
          <Button
            width={3.4}
            height={1.8}
            text="수정"
            fontColor="default"
            fontSize="0.875rem"
            backgroundColor="gray"
            onClick={() => console.log('수정하러 가기')}
          />
          <Button
            width={3.4}
            height={1.8}
            text="삭제"
            fontColor="white"
            fontSize="0.875rem"
            backgroundColor="red"
            onClick={openModal}
          />
          <Modal showModal={showModal} closeModal={closeModal}>
            <Alert
              text="이 일기를 정말 삭제하시겠습니까?"
              onUndoButtonClick={closeModal}
              onAcceptButtonClick={() => console.log('삭제하러 가기')}
            />
          </Modal>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Detail;
