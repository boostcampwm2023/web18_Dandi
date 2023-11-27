import { useState } from 'react';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Icon from '@components/Common/Icon';
import Card from '@components/MyDiary/Card';
import { DATE_CONTROL_INDEX } from '@/util/constants';

const CarouselContainer = (datas: IDiaryContent[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dataLength = Object.keys(datas).length;

  return (
    <section className="flex w-fit items-center justify-center">
      <Card
        data={
          datas[
            activeIndex === 0
              ? activeIndex - DATE_CONTROL_INDEX + dataLength
              : activeIndex - DATE_CONTROL_INDEX
          ]
        }
        styles="w-1/3"
        size="small"
      />
      <button
        onClick={() =>
          setActiveIndex(
            activeIndex === 0
              ? activeIndex - DATE_CONTROL_INDEX + dataLength
              : activeIndex - DATE_CONTROL_INDEX,
          )
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
