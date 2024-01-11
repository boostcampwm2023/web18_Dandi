import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

import { createDiary, updateDiary } from '@api/Edit';

import NavBar from '@components/Common/NavBar';
import Loading from '@components/Common/Loading';
import Header from '@components/Edit/Header';
import Editor from '@components/Edit/Editor';
import KeywordBox from '@components/Edit/KeywordBox';

import { PAGE_URL } from '@util/constants';

import useEditStore from '@store/useEditStore';

import { useToast } from '@hooks/useToast';

interface CreateDiaryParams {
  title: string;
  content: string;
  thumbnail?: string;
  emotion: string;
  tagNames?: string[];
  status: string;
}

const Edit = () => {
  const queryClient = useQueryClient();
  const openToast = useToast();

  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    title,
    setTitle,
    emoji,
    setEmoji,
    thumbnail,
    setThumbnail,
    content,
    setContent,
    keywordList,
    setKeywordList,
    status,
    setStatus,
  } = useEditStore();

  useEffect(() => {
    setTitle(state?.title || '');
    setEmoji(state?.emoji || '😁');
    setThumbnail(state?.thumbnail || '');
    setContent(state?.content || ' ');
    setKeywordList(state?.tagNames || []);
    setStatus(state?.status === 'public' ? '공개 하기' : '나만 보기')
  }, [state]);

  const params: CreateDiaryParams = {
    title,
    content,
    emotion: emoji,
    tagNames: keywordList,
    status: status === '나만 보기' ? 'private' : 'public',
    thumbnail,
  };

  const createDiaryMutation = useMutation({
    mutationFn: (params: CreateDiaryParams) => createDiary(params),
    onSuccess: () => {
      navigate(PAGE_URL.MY_DIARY);
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
      openToast('일기가 작성되었습니다!');
    },
  });

  const updateDiaryMutation = useMutation({
    mutationFn: (params: CreateDiaryParams) => updateDiary(params, state.diaryId),
    onSuccess: () => {
      navigate(`${PAGE_URL.DETAIL}/${state.diaryId}`);
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
      openToast('일기가 수정되었습니다!');
    },
  });

  const onSubmit = () => {
    if (!title || title.trim() === '' || !content || content.trim() === '') {
      openToast('제목과 본문은 필수 입력사항입니다!');
      return;
    }

    if (state) {
      updateDiaryMutation.mutate(params, state.diaryId);
    } else {
      createDiaryMutation.mutate(params);
    }
  };

  if (createDiaryMutation.isError || updateDiaryMutation.isError) {
    return <div>에러!!</div>;
  }

  if (createDiaryMutation.isPending || updateDiaryMutation.isPending) {
    return <Loading phrase="일기를 저장하고 있어요." />;
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <NavBar />
      <Header />
      <Editor />
      <KeywordBox onSubmit={onSubmit} />
    </div>
  );
};

export default Edit;
