import Icon from '@components/Common/Icon';

interface ReactionProps {
  count: number;
  onClick: () => void;
  styles?: string;
}

const Reaction = ({ count, onClick, styles }: ReactionProps) => {
  return (
    <div>
      <div className="flex items-center justify-start gap-1" onClick={onClick}>
        <Icon id="reactionEmoji" />
        <p className={`text-default font-bold ${styles ? styles : 'text-base'}`}>
          친구들의 반응 {count}개
        </p>
      </div>
    </div>
  );
};

export default Reaction;
