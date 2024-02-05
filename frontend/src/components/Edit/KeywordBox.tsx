import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Loading from '@components/Common/Loading';
import Keyword from '@components/Common/Keyword';

import useEditStore from '@store/useEditStore';
import useUserStore from '@store/useUserStore';

import { useToast } from '@hooks/useToast';
import useCreateDiaryMutation from '@hooks/useCreateDiaryMutation';
import useUpdateDiaryMutation from '@hooks/useUpdateDiaryMutation';

interface CreateDiaryParams {
  title: string;
  content: string;
  thumbnail?: string;
  emotion: string;
  tagNames?: string[];
  status: string;
}

const KeywordBox = () => {
  const openToast = useToast();

  const { userId } = useUserStore();
  const { state } = useLocation();
  const [keyword, setKeyword] = useState<string>('');
  const { diaryId, title, content, emoji, status, thumbnail, keywordList, setKeywordList } =
    useEditStore();

  const params: CreateDiaryParams = {
    title,
    content,
    emotion: emoji,
    tagNames: keywordList,
    status: status === '나만 보기' ? 'private' : 'public',
    thumbnail,
  };

  const createDiaryMutation = useCreateDiaryMutation(userId);

  const updateDiaryMutation = useUpdateDiaryMutation(userId, diaryId);

  const onSubmit = () => {
    if (!title || title.trim() === '' || !content || content.trim() === '') {
      openToast('제목과 본문은 필수 입력사항입니다!');
      return;
    }

    if (state?.type == 'update') {
      updateDiaryMutation.mutate(params);
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

  const changeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (!keywordList.includes(keyword)) {
      setKeywordList([...keywordList, keyword]);
    }

    setKeyword('');
  };

  const deleteKeyword = (keyword: string) => {
    const newKeywordList = keywordList.filter((value) => value !== keyword);
    setKeywordList(newKeywordList);
  };

  return (
    <div className="flex w-full flex-col p-2 sm:w-4/5 sm:p-0 ">
      <div className="flex w-full flex-col items-start justify-between sm:flex-row">
        <div>
          <label className="mb-3 text-lg font-bold sm:text-xl" htmlFor="keyword">
            키워드 입력
          </label>
          <p className="my-1 text-xs sm:my-3">엔터를 입력하여 키워드를 등록 할 수 있습니다.</p>
          <p className="my-1 text-xs sm:my-3">등록된 키워드를 클릭하면 삭제됩니다.</p>
        </div>
        <button
          onClick={onSubmit}
          className="bg-brown hidden rounded-lg p-2 px-3 text-lg font-bold sm:flex"
        >
          저장하기
        </button>
      </div>

      <input
        type="text"
        id="keyword"
        value={keyword}
        onChange={changeKeyword}
        onKeyPress={addKeyword}
        className="border-brown mb-3 h-10 w-3/5  rounded-xl border pl-4 outline-none"
      />
      <div className="flex flex-wrap gap-4">
        {keywordList.map((keyword, index) => (
          <div className="cursor-pointer" key={index} onClick={() => deleteKeyword(keyword)}>
            <Keyword text={keyword} />
          </div>
        ))}
      </div>
      <button
        onClick={onSubmit}
        className="bg-brown mb-16 rounded-lg p-2 px-3 text-lg font-bold sm:hidden"
      >
        저장하기
      </button>
    </div>
  );
};

export default KeywordBox;
