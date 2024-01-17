import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteDiary } from '@api/Detail';

import NavBar from '@components/Common/NavBar';
import Button from '@components/Common/Button';
import Modal from '@components/Common/Modal';
import DiaryContent from '@components/Detail/DiaryContent';
import Alert from '@components/Common/Alert';
import Loading from '@components/Common/Loading';

import useEditStore from '@store/useEditStore';

import { useToast } from '@hooks/useToast';
import useModal from '@hooks/useModal';
import useDiaryQuery from '@hooks/useDiaryQuery';
import { PAGE_URL } from '@util/constants';

const Detail = () => {
  const queryClient = useQueryClient();
  const openToast = useToast();
  const navigate = useNavigate();
  const { setDiaryId, setTitle, setEmoji, setThumbnail, setContent, setKeywordList, setStatus } =
    useEditStore();
  const { openModal, closeModal } = useModal();

  const params = useParams();
  const diaryId = Number(params.diaryId);

  const { data, isLoading, isError } = useDiaryQuery(diaryId);

  const deleteDiaryMutation = useMutation({
    mutationFn: () => deleteDiary(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['grass', localStorage.getItem('userId')],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: ['emotionStat', localStorage.getItem('userId')],
        refetchType: 'all',
      });
      queryClient.removeQueries({
        queryKey: ['dayDiaryList', localStorage.getItem('userId')],
      });
      queryClient.removeQueries({
        queryKey: ['myDayDiaryList', localStorage.getItem('userId')],
      });
      navigate(-1);
      openToast('일기가 삭제되었습니다!');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDelete = () => {
    deleteDiaryMutation.mutate();
    closeModal();
  };

  const showDeleteModal = () => {
    openModal({
      children: (
        <Alert
          text="이 일기를 정말 삭제하시겠습니까?"
          onUndoButtonClick={closeModal}
          onAcceptButtonClick={handleDelete}
        />
      ),
    });
  };

  useEffect(() => {
    if (data) {
      setDiaryId(diaryId);
      setTitle(data.title);
      setContent(data.content);
      setEmoji(data.emotion);
      setThumbnail(data.thumbnail);
      setKeywordList(data.tagNames);
      setStatus(data.status === 'public' ? '공개 하기' : '나만 보기');
    }
  }, [data]);

  if (isLoading) {
    return <Loading phrase="로딩 중이에요." />;
  }

  if (isError) {
    navigate(`${PAGE_URL.NOT_FOUND}`);
  }

  const content = <DiaryContent diaryId={diaryId} {...data} />;
  const loginUser = localStorage.getItem('userId') ?? 0;
  const isMyDiary = +loginUser === data.userId;
  return (
    <>
      <div className="flex flex-col items-center">
        <NavBar />
        <div className="mt-5 flex w-full flex-col gap-4 p-1 sm:w-2/3 sm:p-0">
          {content}
          {isMyDiary && (
            <div className="mb-20 flex justify-around">
              <Button
                text="수정"
                type="normal"
                onClick={() =>
                  navigate(PAGE_URL.EDIT, {
                    state: {
                      type: 'update',
                    },
                  })
                }
              />
              <Button text="삭제" type="delete" onClick={showDeleteModal} />
            </div>
          )}
        </div>
      </div>
      <Modal />
    </>
  );
};

export default Detail;
