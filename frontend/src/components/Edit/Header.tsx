import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';

const Header = () => {
  const [title, setTitle] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('😁');
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('나만 보기');

  const toggleEmoji = () => {
    setShowEmoji((pre) => !pre);
  };

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const changeEmoji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmoji(e.target.value);
  };

  const toggleStatus = () => {
    setStatus((pre) => (pre === '나만 보기' ? '공개하기' : '나만 보기'));
  };

  const onClickEmoji = (emojiData: any) => {
    setEmoji(emojiData.emoji);
    toggleEmoji();
  };

  return (
    <div className="w-[80%]">
      <div>
        <p className="mb-5 text-2xl font-bold">오늘 기분은 어떠세요?</p>
        <div className="relative mb-5 flex">
          <input
            className="mr-3 w-[2.5rem] cursor-pointer text-4xl outline-none"
            type="text"
            name="emoji"
            id="emoji"
            value={emoji}
            onChange={changeEmoji}
            onClick={toggleEmoji}
            readOnly
          />
          <select className="border-brown h-[2.5rem] rounded-xl border-[1px] px-2" name="emotion">
            <option value="5">아주 좋음</option>
            <option value="4">좋음</option>
            <option value="3">그럭저럭</option>
            <option value="2">나쁨</option>
            <option value="1">아주 나쁨</option>
          </select>
        </div>
        {showEmoji && <EmojiPicker onEmojiClick={onClickEmoji} />}
      </div>
      <div className="flex items-center justify-start ">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="border-brown mb-5 mr-10 h-[3rem] w-[60%] rounded-xl border-[1px] pl-4 outline-none"
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
            className={`h-[2rem] w-[2rem] cursor-pointer appearance-none bg-[url("./assets/image/lock.svg")] bg-no-repeat checked:bg-[url("./assets/image/unlocked.svg")]`}
            onChange={toggleStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
