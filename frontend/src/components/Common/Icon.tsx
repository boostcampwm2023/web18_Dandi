import icons from '@assets/image/icons.svg';

import {
  DEFAULT,
  DEFAULT_VIEWBOX_HEIGHT,
  DEFAULT_VIEWBOX_WIDTH,
  LARGE_VIEWBOX_HEIGHT,
  LARGE_VIEWBOX_WIDTH,
} from '@util/constants';

interface ReactionProps {
  id: string;
  styles?: string;
  size?: 'default' | 'large';
}

const Icon = ({ id, styles, size = DEFAULT }: ReactionProps) => {
  const iconSize = {
    large: {
      width: LARGE_VIEWBOX_WIDTH,
      height: LARGE_VIEWBOX_HEIGHT,
    },
    default: {
      width: DEFAULT_VIEWBOX_WIDTH,
      height: DEFAULT_VIEWBOX_HEIGHT,
    },
  };
  return (
    <svg
      width={iconSize[size].width}
      height={iconSize[size].height}
      viewBox={`0 0 ${iconSize[size].width} ${iconSize[size].height}`}
      className={styles}
    >
      <use href={`${icons}#${id}`} />
    </svg>
  );
};

export default Icon;
