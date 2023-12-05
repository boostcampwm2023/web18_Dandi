import { useEffect, useState } from 'react';

import { getTagRecommend } from '@api/KeywordSearch';

import { searchOptionsType } from '@type/pages/MyDiary';

import Icon from '@components/Common/Icon';

import { DEBOUNCE_TIME } from '@util/constants';

interface KeywordSearchProps {
  keywordList: string[];
  selected: searchOptionsType;
  setKeywordList: React.Dispatch<React.SetStateAction<string[]>>;
  setSelected: React.Dispatch<React.SetStateAction<searchOptionsType>>;
  setSearchFlag: React.Dispatch<React.SetStateAction<boolean>>;
  setContentSearchItem: React.Dispatch<React.SetStateAction<string>>;
}

const KeywordSearch = ({
  keywordList,
  selected,
  setKeywordList,
  setSelected,
  setSearchFlag,
  setContentSearchItem,
}: KeywordSearchProps) => {
  const [keyword, setKeyword] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [showKeyword, setShowKeyword] = useState(false);
  const [recommendKeyword, setRecommendKeyword] = useState<string[]>();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (keyword) {
        const data = await getTagRecommend(keyword);
        setRecommendKeyword(data.keywords);
      } else {
        setSearchFlag(false);
      }
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timer);
  }, [keyword]);

  const searchOptions: searchOptionsType[] = ['키워드', '제목 + 내용'];

  const toggleShowSelect = () => setShowSelect((prev) => !prev);
  const toggleShowKeyword = () => setShowKeyword((prev) => !prev);

  const onChangeSearchOption = (option: searchOptionsType) => {
    if (option === '키워드' && selected === '제목 + 내용') {
      setContentSearchItem('');
    }
    if (option === '제목 + 내용' && selected === '키워드') {
      setKeywordList([]);
    }
    setRecommendKeyword([]);
    setSelected(option);
    setShowSelect(false);
    setKeyword('');
  };

  const onClickKeywordOption = (option: string) => {
    if (selected === '키워드') {
      if (!keywordList.includes(option)) {
        setKeywordList([option, ...keywordList]);
      }
      setKeyword('');
    }
    if (selected === '제목 + 내용') {
      setContentSearchItem(option);
      setKeyword(option);
      setSearchFlag(true);
    }
    setRecommendKeyword([]);
    setShowKeyword(false);
  };
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFlag(false);
    setKeyword(e.target.value);
    setShowKeyword(true);
  };
  const onClickKeywordCancel = (keywordItem: string) => {
    setKeywordList(keywordList.filter((item) => item !== keywordItem));
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
        <div className="flex justify-between py-3 pl-4 pr-3">
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
        {selected === '키워드' && (
          <aside className="absolute top-14 -z-20 flex gap-2">
            {keywordList.map((item) => (
              <div className="border-mint flex items-center gap-1 rounded-lg border border-solid py-2 pl-3 pr-2 text-sm">
                <p key={item}>{item}</p>
                <button onClick={() => onClickKeywordCancel(item)}>
                  <Icon id="cancel" size="small" />
                </button>
              </div>
            ))}
          </aside>
        )}
      </div>
    </section>
  );
};

export default KeywordSearch;
