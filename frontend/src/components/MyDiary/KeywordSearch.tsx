import search from '@assets/image/search.svg';
import { useState } from 'react';

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  return (
    <div className="border-brown flex flex-row rounded-2xl border border-solid px-4 py-2">
      <p className="text-2xl font-bold">#</p>
      <input
        className="mx-3 w-[20rem] outline-none"
        placeholder="키워드를 입력하세요"
        value={keyword}
        type="text"
        onChange={onChangeKeyword}
      />
      <img src={search} />
    </div>
  );
};

export default KeywordSearch;
