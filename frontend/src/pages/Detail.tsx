import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { referDiary, deleteDiary } from '@api/Detail';

import NavBar from '@components/Common/NavBar';
import Button from '@components/Common/Button';
import Modal from '@components/Common/Modal';
import DiaryContent from '@components/Detail/DiaryContent';
import Alert from '@components/Common/Alert';

import { PAGE_URL } from '@util/constants';

const Detail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal((prev) => !prev);

  const params = useParams();
  const diaryId = Number(params.diaryId);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['diary', diaryId],
    queryFn: () => referDiary(diaryId),
  });

  const deleteDiaryMutation = useMutation({
    mutationFn: () => deleteDiary(diaryId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['myDayDiaryList', localStorage.getItem('userId')],
      });
      navigate(PAGE_URL.MY_DIARY);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDelete = () => {
    deleteDiaryMutation.mutate();
    toggleShowModal();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  const content = <DiaryContent diaryId={diaryId} {...data} />;

  return (
    <div className="flex flex-col items-center">
      <NavBar />
      <div className="flex w-2/3 flex-col gap-2">
        <div className="flex justify-end gap-2">
          <Button
            text="수정"
            type="normal"
            onClick={() =>
              navigate(PAGE_URL.EDIT, {
                state: {
                  diaryId: diaryId,
                  title: data.title,
                  content: data.content,
                  emotion: data.emotion,
                  thumbnail: data.thumbnail,
                  tags: data.tags,
                  status: data.status,
                },
              })
            }
          />
          <Button text="삭제" type="delete" onClick={toggleShowModal} />
          <Modal showModal={showModal} closeModal={toggleShowModal}>
            <Alert
              text="이 일기를 정말 삭제하시겠습니까?"
              onUndoButtonClick={toggleShowModal}
              onAcceptButtonClick={handleDelete}
            />
          </Modal>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Detail;
