import emojiIcon from '@assets/image/reactionEmoji.svg';

interface ReactionProps {
  count: number;
}

const Reaction = ({ count }: ReactionProps) => {
  return (
    <div className="flex items-center justify-start">
      <img src={emojiIcon} alt="리액션 아이콘" />
      <p className="color text-default text-base font-bold">친구들의 반응 {count}개</p>
    </div>
  );
};

export default Reaction;
