import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

import { createDiary, updateDiary } from '@api/Edit';

import NavBar from '@components/Common/NavBar';
import Header from '@components/Edit/Header';
import Editor from '@components/Edit/Editor';
import KeywordBox from '@components/Edit/KeywordBox';

interface CreateDiaryParams {
  title: string;
  content: string;
  thumbnail?: string;
  emotion: string;
  tagNames?: string[];
  status: string;
}

const Edit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [keywordList, setKeywordList] = useState<string[]>(state ? state.tags : []);
  const [title, setTitle] = useState(state ? state.title : '');
  const [emoji, setEmoji] = useState(state ? state.emotion : '😁');
  const [status, setStatus] = useState('나만 보기');
  const [content, setContent] = useState(state ? state.content : '');

  const params: CreateDiaryParams = {
    title,
    content,
    emotion: emoji,
    tagNames: keywordList,
    status: status === '나만 보기' ? 'private' : 'public',
  };

  const {
    mutate: createAPI,
    isError,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (params: CreateDiaryParams) => {
      if (state.diaryId) return updateDiary(params, state.diaryId);
      else return createDiary(params);
    },
  });

  const onSubmit = () => {
    if (!title || title.trim() === '') return;
    if (!content || content.trim() === '') return;

    createAPI(params);
  };

  if (isError) {
    return <div>에러!!</div>;
  }

  if (isPending) {
    return <div>일기 저장중...</div>;
  }

  if (isSuccess) {
    navigate('/my-diary');
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <NavBar />
      <Header
        title={title}
        emoji={emoji}
        setTitle={setTitle}
        setEmoji={setEmoji}
        setStatus={setStatus}
      />
      <Editor content={content} setContent={setContent} />
      <KeywordBox keywordList={keywordList} setKeywordList={setKeywordList} onSubmit={onSubmit} />
    </div>
  );
};

export default Edit;
