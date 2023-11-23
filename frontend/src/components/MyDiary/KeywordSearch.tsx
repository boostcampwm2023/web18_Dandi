import { useState } from 'react';

import Icon from '@components/Common/Icon';

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  return (
    <div className="border-brown flex flex-row items-center rounded-2xl border border-solid px-4 py-2">
      <p className="text-2xl font-bold">#</p>
      <input
        className="mx-3 w-80 outline-none"
        placeholder="키워드를 입력하세요"
        value={keyword}
        type="text"
        onChange={onChangeKeyword}
      />
      <Icon id="search" />
    </div>
  );
};

export default KeywordSearch;
