import icons from '@assets/image/icons.svg';

interface ReactionProps {
  id: string;
  styles?: string;
  size?: 'default' | 'large';
}

// large일 때 추가하기
const Icon = ({ id, styles, size = 'default' }: ReactionProps) => {
  const widthSize = size === 'large' ? 95 : 24;
  const heightSize = size === 'large' ? 82 : 24;
  return (
    <svg
      width={widthSize}
      height={heightSize}
      viewBox={`0 0 ${widthSize} ${heightSize}`}
      className={styles}
    >
      <use href={`${icons}#${id}`} />
    </svg>
  );
};

export default Icon;
