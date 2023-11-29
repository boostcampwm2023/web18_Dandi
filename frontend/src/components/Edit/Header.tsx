import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

interface HeaderProps {
  title: string;
  emoji: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({ emoji, title, setTitle, setStatus, setEmoji }: HeaderProps) => {
  const [showEmoji, setShowEmoji] = useState(false);

  const toggleEmoji = () => setShowEmoji((prev) => !prev);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const changeEmoji = (e: React.ChangeEvent<HTMLInputElement>) => setEmoji(e.target.value);

  const toggleStatus = () => setStatus((pre) => (pre === '나만 보기' ? '공개 하기' : '나만 보기'));

  const onClickEmoji = (emojiData: any) => {
    setEmoji(emojiData.emoji);
    toggleEmoji();
  };

  return (
    <div className="w-[80%]">
      <div>
        <p className="mb-5 text-2xl font-bold">오늘 기분은 어떠세요?</p>
        <div className="relative mb-5 flex items-center">
          <input
            className="mr-3 h-[2.8rem] w-[2.8rem] cursor-pointer text-4xl outline-none"
            type="text"
            name="emoji"
            id="emoji"
            value={emoji}
            onChange={changeEmoji}
            onClick={toggleEmoji}
            readOnly
          />
        </div>
        {showEmoji && <EmojiPicker onEmojiClick={onClickEmoji} />}
      </div>
      <div className="flex items-center justify-start ">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="border-brown mb-5 mr-10 h-12 w-3/5 rounded-xl border pl-4 outline-none"
          onChange={changeTitle}
          value={title}
        />
        <div className="mb-5 flex items-center justify-center">
          <label className="mr-3 cursor-pointer text-lg font-bold " htmlFor="status">
            {status}
          </label>
          <input
            type="checkbox"
            id="status"
            className={`h-8 w-8 cursor-pointer appearance-none bg-[url("./assets/image/lock.svg")] bg-no-repeat checked:bg-[url("./assets/image/unlocked.svg")]`}
            onChange={toggleStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
