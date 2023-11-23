import Icon from '@components/Common/Icon';
interface ReactionProps {
  count: number;
  onClick: () => void;
}

const Reaction = ({ count, onClick }: ReactionProps) => {
  return (
    <div>
      <div className="flex items-center justify-start gap-1" onClick={onClick}>
        <Icon id="reactionEmoji" />
        <p className="text-default text-base font-bold">친구들의 반응 {count}개</p>
      </div>
    </div>
  );
};

export default Reaction;
