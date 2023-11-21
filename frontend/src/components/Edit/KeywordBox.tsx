import KeywordItem from '@components/Edit/KeywordItem';

import { useState } from 'react';

interface KeywordBoxProps {
  keywordList: string[];
  setKeywordList: React.Dispatch<React.SetStateAction<string[]>>;
}

const KeywordBox = ({ keywordList, setKeywordList }: KeywordBoxProps) => {
  const [keyword, setKeyword] = useState<string>('');

  const changeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setKeywordList((pre) => [...pre, keyword]);
      setKeyword('');
    }
  };

  return (
    <div className="flex w-[80%] flex-col ">
      <div className="flex w-full justify-between">
        <label className="mb-3 text-xl font-bold" htmlFor="keyword">
          키워드 입력
        </label>
        <button className="bg-brown rounded-lg px-3 text-lg font-bold">저장하기</button>
      </div>

      <input
        type="text"
        id="keyword"
        value={keyword}
        onChange={changeKeyword}
        onKeyPress={addKeyword}
        className="border-brown mb-3 h-[2.5rem]  w-[30%] rounded-xl border pl-4 outline-none"
      />
      <KeywordItem keywordList={keywordList} />
    </div>
  );
};

export default KeywordBox;
