import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import useEditStore from '@store/useEditStore';

const Header = () => {
  const { state } = useLocation();
  const [showEmoji, setShowEmoji] = useState(false);
  const { title, setTitle, emoji, setEmoji, status, setStatus } = useEditStore();

  useEffect(() => {
    setTitle(state?.title || '');
    setEmoji(state?.emoji || '😁');
    setStatus(state?.status === 'public' ? '공개 하기' : '나만 보기');
  }, [state]);

  const toggleEmoji = () => setShowEmoji((prev) => !prev);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const changeEmoji = (e: React.ChangeEvent<HTMLInputElement>) => setEmoji(e.target.value);

  const toggleStatus = () => setStatus(status === '나만 보기' ? '공개 하기' : '나만 보기');

  const onClickEmoji = (emojiData: any) => {
    setEmoji(emojiData.emoji);
    toggleEmoji();
  };

  return (
    <div className="w-full p-2 sm:w-[80%] sm:p-0">
      <div className="relative mb-3 flex items-center sm:mb-0 sm:block">
        <p className="mr-10 text-xl font-bold sm:mb-5 sm:text-2xl">오늘 기분은 어떠세요?</p>
        <div className="relative flex items-center sm:mb-5">
          <input
            className="bg-body h-[2.8rem] w-[2.8rem] cursor-pointer bg-transparent text-4xl outline-none"
            type="text"
            name="emoji"
            id="emoji"
            value={emoji}
            onChange={changeEmoji}
            onClick={toggleEmoji}
            readOnly
          />
        </div>
        {showEmoji && (
          <aside className="absolute top-24 z-50">
            <EmojiPicker onEmojiClick={onClickEmoji} />
          </aside>
        )}
      </div>
      <div className="flex items-center justify-start ">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="border-brown mr-10 h-12 w-3/5 rounded-xl border pl-4 outline-none sm:mb-5"
          onChange={changeTitle}
          value={title}
        />
        <div className="flex items-center justify-center sm:mb-5">
          <label className="text-md mr-3 cursor-pointer font-bold sm:text-lg " htmlFor="status">
            {status}
          </label>
          <input
            checked={status === '나만 보기' ? false : true}
            type="checkbox"
            id="status"
            className={`h-8 w-8  cursor-pointer appearance-none bg-[url("./assets/image/lock.svg")] bg-no-repeat checked:bg-[url("./assets/image/unlocked.svg")]`}
            onChange={toggleStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
