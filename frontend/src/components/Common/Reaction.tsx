import Icon from '@components/Common/Icon';

interface ReactionProps {
  count: number;
  iconOnClick?: () => void;
  textOnClick?: () => void;
  styles?: string;
  emoji?: string;
}

const Reaction = ({ count, iconOnClick, textOnClick, styles, emoji }: ReactionProps) => {
  return (
    <div>
      <div className="flex items-center justify-start gap-2">
        <button onClick={iconOnClick}>
          {emoji ? <p className="text-2xl leading-6">{emoji}</p> : <Icon id="reactionEmoji" />}
        </button>
        <p
          className={`text-default cursor-pointer font-bold ${styles ? styles : 'text-base'}`}
          onClick={textOnClick}
        >
          공감 {new Intl.NumberFormat().format(count)}개
        </p>
      </div>
    </div>
  );
};

export default Reaction;
