import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createDiary } from '@api/Edit';

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

  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('😁');
  const [status, setStatus] = useState('나만 보기');
  const [content, setContent] = useState('');

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
      return createDiary(params);
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
      <Editor setContent={setContent} />
      <KeywordBox keywordList={keywordList} setKeywordList={setKeywordList} onSubmit={onSubmit} />
    </div>
  );
};

export default Edit;
