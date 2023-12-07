import { useEffect, useRef, useState } from 'react';

import { getTagRecommend } from '@api/KeywordSearch';

import { searchOptionsType } from '@type/pages/MyDiary';

import Icon from '@components/Common/Icon';

import { DEBOUNCE_TIME } from '@util/constants';

interface KeywordSearchProps {
  keyword: string;
  selected: searchOptionsType;
  searchFlag: boolean;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  setSelected: React.Dispatch<React.SetStateAction<searchOptionsType>>;
  setSearchFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const KeywordSearch = ({
  keyword,
  selected,
  searchFlag,
  setKeyword,
  setSelected,
  setSearchFlag,
}: KeywordSearchProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [showKeyword, setShowKeyword] = useState(false);
  const [recommendKeyword, setRecommendKeyword] = useState<string[]>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutSideClick = (e: any) => {
      if (
        searchInputRef.current &&
        searchInputRef.current !== e.target &&
        !e.target.classList.contains('recommendedItem')
      ) {
        setShowKeyword(false);
      }
      if (
        optionRef.current &&
        optionRef.current !== e.target &&
        !e.target.classList.contains('searchOptionItem')
      ) {
        setShowSelect(false);
      }
    };
    document.addEventListener('mousedown', handleOutSideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [searchInputRef, optionRef]);

  useEffect(() => {
    if (keyword && selected === '키워드' && !searchFlag) {
      const timer = setTimeout(async () => {
        const data = await getTagRecommend(keyword);
        setRecommendKeyword(data.keywords);
      }, DEBOUNCE_TIME);
      return () => clearTimeout(timer);
    }
  }, [keyword]);

  const searchOptions: searchOptionsType[] = ['키워드', '제목 + 내용'];

  const onChangeSearchOption = (option: searchOptionsType) => {
    setSelected(option);
    setSearchFlag(true);
    setShowSelect(false);
  };
  const onClickKeywordOption = (option: string) => {
    setKeyword(option);
    setSearchFlag(true);
    setShowKeyword(false);
  };
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFlag(false);
    setKeyword(e.target.value);
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      setSearchFlag(true);
    }
  };

  return (
    <section className="relative flex items-start gap-3">
      <div
        ref={optionRef}
        className="border-brown relative w-32 rounded-xl border border-solid bg-white py-3 pl-4 pr-3"
      >
        <button
          className="flex w-full items-center justify-between"
          onFocus={() => setShowSelect(true)}
        >
          <p>{selected}</p>
          <Icon id="down" size="small" />
        </button>
        {showSelect && (
          <ul className="border-brown absolute left-0 top-12 z-50 w-full cursor-pointer rounded-xl border border-solid bg-white">
            {searchOptions.map((option) => (
              <li
                key={option}
                onClick={() => onChangeSearchOption(option)}
                className={
                  'searchOptionItem hover:bg-brown px-3 py-2.5 text-sm first:rounded-t-lg last:rounded-b-lg hover:text-white'
                }
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-brown absolute left-36 z-50 flex w-auto flex-col rounded-xl border border-solid bg-white">
        <div className="relative flex justify-between py-3 pl-4 pr-3">
          <input
            className="outline-none"
            placeholder="검색어를 입력하세요"
            value={keyword}
            type="text"
            onChange={onChangeKeyword}
            onFocus={() => setShowKeyword(true)}
            onKeyDown={onKeyDownInput}
            ref={searchInputRef}
          />
          <button onClick={() => setSearchFlag(true)}>
            <Icon id="search" />
          </button>
        </div>
        {showKeyword && selected === '키워드' && (
          <>
            <hr className="text-gray" />
            <div className="rounded-xl bg-white text-sm">
              {!recommendKeyword?.length && (
                <p className="px-3 py-2.5">추천 검색어가 존재하지 않습니다.</p>
              )}
              {recommendKeyword &&
                recommendKeyword.map((keyword: string) => (
                  <p
                    className="recommendedItem hover:bg-brown cursor-pointer px-3 py-2.5 last:rounded-b-lg hover:font-bold hover:text-white"
                    key={keyword}
                    onClick={() => onClickKeywordOption(keyword)}
                  >
                    {keyword}
                  </p>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default KeywordSearch;
