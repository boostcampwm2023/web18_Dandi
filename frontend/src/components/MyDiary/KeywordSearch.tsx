import { useState } from 'react';

import Icon from '@components/Common/Icon';

type searchOptionsType = '키워드' | '제목 + 내용';

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [selected, setSelected] = useState<searchOptionsType>('키워드');
  const [showSelect, setShowSelect] = useState(false);
  const [showKeyword, setShowKeyword] = useState(false);
  const [autoKeywordList, _] = useState<string[]>(['안녕', '안녕녕', '안녕하세요']);

  const searchOptions: searchOptionsType[] = ['키워드', '제목 + 내용'];

  const toggleShowSelect = () => setShowSelect((prev) => !prev);
  const onChangeSearchOption = (option: searchOptionsType) => {
    setSelected(option);
    setShowSelect(false);
  };

  const offShowKeyword = () => setShowKeyword(false);
  const onClickKeywordOption = (option: string) => {
    setKeyword(option);
    setShowKeyword(false);
  };
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setShowKeyword(true);
  };

  return (
    <section className="flex gap-3">
      <div className="border-brown relative w-44 rounded-xl border border-solid py-3 pl-4 pr-3">
        <button className="flex w-full items-center justify-between" onClick={toggleShowSelect}>
          <p>{selected}</p>
          <Icon id="down" size="small" />
        </button>
        {showSelect && (
          <ul className="border-brown absolute left-0 top-12 w-full cursor-pointer rounded-xl border border-solid bg-white">
            {searchOptions.map((option) => (
              <li
                key={option}
                onClick={() => onChangeSearchOption(option)}
                className={
                  'hover:bg-brown px-3 py-2.5 text-sm first:rounded-t-lg last:rounded-b-lg hover:text-white'
                }
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-brown relative w-full rounded-xl border border-solid">
        <div className="relative flex justify-between py-3 pl-4 pr-3">
          <input
            className="outline-none"
            placeholder="검색어를 입력하세요"
            value={keyword}
            type="text"
            onChange={onChangeKeyword}
            onClick={offShowKeyword}
          />
          <Icon id="search" />
          {showKeyword && (
            <div className="border-brown absolute left-0 top-12 z-50 w-full rounded-xl border border-solid bg-white text-sm">
              {autoKeywordList.map((keyword) => (
                <p
                  className="hover:bg-brown cursor-pointer px-3 py-2.5 first:rounded-t-lg last:rounded-b-lg hover:font-bold hover:text-white"
                  key={keyword}
                  onClick={() => onClickKeywordOption(keyword)}
                >
                  {keyword}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KeywordSearch;
