import icons from '@assets/image/icons.svg';

interface ReactionProps {
  id: string;
  styles?: string;
}

// large일 때 추가하기
const Icon = ({ id, styles }: ReactionProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className={styles}>
      <use href={`${icons}#${id}`} />
    </svg>
  );
};

export default Icon;
