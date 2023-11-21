import emojiIcon from '@assets/image/reactionEmoji.svg';

interface ReactionProps {
  count: number;
  onClick: () => void;
}

const Reaction = ({ count, onClick }: ReactionProps) => {
  return (
    <div>
      <div className="flex items-center justify-start" onClick={onClick}>
        <img src={emojiIcon} alt="리액션 아이콘" />
        <p className="text-default text-base font-bold">친구들의 반응 {count}개</p>
      </div>
    </div>
  );
};

export default Reaction;
