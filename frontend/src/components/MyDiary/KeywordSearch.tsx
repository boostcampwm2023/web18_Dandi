import { useEffect, useState } from 'react';

import { getTagRecommend } from '@api/KeywordSearch';

import Icon from '@components/Common/Icon';

import { searchOptionsType } from '@/types/pages/MyDiary';

interface KeywordSearchProps {
  keyword: string;
  selected: searchOptionsType;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  setSelected: React.Dispatch<React.SetStateAction<searchOptionsType>>;
  setSearchFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const KeywordSearch = ({
  keyword,
  selected,
  setKeyword,
  setSelected,
  setSearchFlag,
}: KeywordSearchProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [showKeyword, setShowKeyword] = useState(false);
  const [recommendKeyword, setRecommendKeyword] = useState<string[]>();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (keyword) {
        const data = await getTagRecommend(keyword);
        setRecommendKeyword(data.keywords);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [keyword]);

  const searchOptions: searchOptionsType[] = ['키워드', '제목 + 내용'];

  const toggleShowSelect = () => setShowSelect((prev) => !prev);
  const toggleShowKeyword = () => setShowKeyword((prev) => !prev);

  const onChangeSearchOption = (option: searchOptionsType) => {
    setSelected(option);
    setSearchFlag(true);
    setShowSelect(false);
  };
  const onClickKeywordOption = (option: string) => {
    setKeyword(option);
    setShowKeyword(false);
  };
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFlag(false);
    setKeyword(e.target.value);
    setShowKeyword(true);
  };

  return (
    <section className="relative flex items-start gap-3">
      <div className="border-brown relative w-32 rounded-xl border border-solid py-3 pl-4 pr-3">
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
      <div className="border-brown absolute left-36 z-50 flex w-auto flex-col rounded-xl border border-solid">
        <div className="relative flex justify-between py-3 pl-4 pr-3">
          <input
            className="outline-none"
            placeholder="검색어를 입력하세요"
            value={keyword}
            type="text"
            onChange={onChangeKeyword}
            onClick={toggleShowKeyword}
          />
          <button onClick={() => setSearchFlag(true)}>
            <Icon id="search" />
          </button>
        </div>
        {showKeyword && (
          <>
            <hr className="text-gray" />
            <div className="rounded-xl bg-white text-sm">
              {!recommendKeyword?.length && (
                <p className="px-3 py-2.5">추천 검색어가 존재하지 않습니다.</p>
              )}
              {recommendKeyword &&
                recommendKeyword.map((keyword: string) => (
                  <p
                    className="hover:bg-brown cursor-pointer px-3 py-2.5 last:rounded-b-lg hover:font-bold hover:text-white"
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
