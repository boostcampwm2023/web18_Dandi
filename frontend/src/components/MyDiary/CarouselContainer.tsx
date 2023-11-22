import { useState, useEffect } from 'react';
import Icon from '../Common/Icon';
import Card from './Card';
import { IDiaryContent } from '@type/components/Common/DiaryList';

const CarouselContainer = (datas: IDiaryContent[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dataLength = Object.keys(datas).length;

  useEffect(() => {
    const prevIndex = activeIndex - 1 === 0 ? activeIndex - 1 + dataLength : activeIndex - 1;
    const nextIndex = (activeIndex + 1) % dataLength;
    console.log(prevIndex, datas[prevIndex], nextIndex, datas[nextIndex]);
  }, [activeIndex]);

  return (
    <section className="flex w-fit items-center justify-center">
      <Card
        data={datas[activeIndex === 0 ? activeIndex - 1 + dataLength : activeIndex - 1]}
        styles="w-1/3"
        size="small"
      />
      <button
        onClick={() =>
          setActiveIndex(activeIndex === 0 ? activeIndex - 1 + dataLength : activeIndex - 1)
        }
      >
        <Icon id="largeLeftArrow" size="large" />
      </button>
      <Card data={datas[activeIndex]} styles="w-2/3" />
      <button onClick={() => setActiveIndex((activeIndex + 1) % dataLength)}>
        <Icon id="largeRightArrow" size="large" />
      </button>
      <Card data={datas[(activeIndex + 1) % dataLength]} styles="w-1/3" size="small" />
    </section>
  );
};

export default CarouselContainer;
