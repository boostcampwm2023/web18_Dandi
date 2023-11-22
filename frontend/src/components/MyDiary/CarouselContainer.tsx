import { useState } from 'react';
import Icon from '../Common/Icon';
import leftArrow from '@assets/image/leftArrow.svg';
import rightArrow from '@assets/image/rightArrow.svg';
import { DUMMY_DATA } from '@/util/constants';
import Card from './Card';

const CarouselContainer = () => {
  //   const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section className="flex items-center justify-center">
      <img src={leftArrow} />
      <Card {...DUMMY_DATA[0]} />
      <img src={rightArrow} />
    </section>
  );
};

export default CarouselContainer;
