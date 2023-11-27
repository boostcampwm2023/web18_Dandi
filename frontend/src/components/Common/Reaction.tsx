import Icon from '@components/Common/Icon';

interface ReactionProps {
  count: number;
  onClick: () => void;
  styles?: string;
  type?: 'check' | 'leave';
}

const Reaction = ({ count, onClick, styles, type }: ReactionProps) => {
  return (
    <div>
      <div className="flex items-center justify-start gap-2" onClick={onClick}>
        <Icon id="reactionEmoji" />
        <p className={`text-default font-bold ${styles ? styles : 'text-base'}`}>
          {type === 'leave' ? '반응 남기기' : `친구들의 반응 ${count}개`}
        </p>
      </div>
    </div>
  );
};

export default Reaction;
