import { useState } from 'react';
import Keyword from '../Common/Keyword';

interface KeywordBoxProps {
  keywordList: string[];
  setKeywordList: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
}

const KeywordBox = ({ keywordList, setKeywordList, onSubmit }: KeywordBoxProps) => {
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

  const deleteKeyword = (keyword: string) => {
    const newKeywordList = keywordList.filter((value) => value !== keyword);
    setKeywordList(newKeywordList);
  };

  return (
    <div className="flex w-4/5 flex-col ">
      <div className="flex w-full justify-between">
        <label className="mb-3 text-xl font-bold" htmlFor="keyword">
          키워드 입력
        </label>
        <button onClick={onSubmit} className="bg-brown rounded-lg px-3 text-lg font-bold">
          저장하기
        </button>
      </div>

      <input
        type="text"
        id="keyword"
        value={keyword}
        onChange={changeKeyword}
        onKeyPress={addKeyword}
        className="border-brown mb-3 h-10  w-[30%] rounded-xl border pl-4 outline-none"
      />
      <div className="flex flex-wrap gap-4">
        {keywordList.map((keyword, index) => (
          <div className="cursor-pointer" key={index} onClick={() => deleteKeyword(keyword)}>
            <Keyword text={keyword} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordBox;
