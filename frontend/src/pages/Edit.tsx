import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

import { createDiary, updateDiary } from '@api/Edit';

import NavBar from '@components/Common/NavBar';
import Header from '@components/Edit/Header';
import Editor from '@components/Edit/Editor';
import KeywordBox from '@components/Edit/KeywordBox';

import { PAGE_URL } from '@util/constants';

import { useToast } from '@/hooks/useToast';

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
  const [keywordList, setKeywordList] = useState<string[]>(state?.tagNames || []);
  const [title, setTitle] = useState(state?.title || '');
  const [emoji, setEmoji] = useState(state?.emotion || '😁');
  const [status, setStatus] = useState(
    state && state.status === 'public' ? '공개 하기' : '나만 보기',
  );
  const [thumbnail, setThumbnail] = useState(state?.thumbnail || '');
  const [content, setContent] = useState(state?.content || ' ');

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
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <svg className="fill-mint h-20 w-20 animate-spin" viewBox="3 3 18 18">
            <path
              className="opacity-70"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            ></path>
            <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
          </svg>
          <p className="text-lg font-bold">일기를 저장하고 있어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <NavBar />
      <Header
        title={title}
        emoji={emoji}
        setTitle={setTitle}
        setEmoji={setEmoji}
        status={status}
        setStatus={setStatus}
      />
      <Editor
        content={content}
        setContent={setContent}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
      />
      <KeywordBox keywordList={keywordList} setKeywordList={setKeywordList} onSubmit={onSubmit} />
    </div>
  );
};

export default Edit;
