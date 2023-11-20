import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';

const Header = () => {
  const [title, setTitle] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('😁');
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('나만 보기');

  const emotionList = [
    ['아주 좋음', 5],
    ['좋음', 4],
    ['그저그럼', 3],
    ['나쁨', 2],
    ['아주 나쁨', 1],
  ];

  const toggleEmoji = () => {
    setShowEmoji((prev) => !prev);
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
          <select
            className="border-brown h-[2.5rem] rounded-xl border px-2 outline-none"
            name="emotion"
          >
            {emotionList.map((item, index) => {
              const [emotion, value] = item;
              return (
                <option key={index} value={value}>
                  {emotion}
                </option>
              );
            })}
          </select>
        </div>
        {showEmoji && <EmojiPicker onEmojiClick={onClickEmoji} />}
      </div>
      <div className="flex items-center justify-start ">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="border-brown mb-5 mr-10 h-[3rem] w-[60%] rounded-xl border pl-4 outline-none"
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