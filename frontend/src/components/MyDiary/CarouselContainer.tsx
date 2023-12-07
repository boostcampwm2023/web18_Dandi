import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import SwiperClass from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { IDiaryContent } from '@type/components/Common/DiaryList';

import Icon from '@components/Common/Icon';
import Card from '@components/MyDiary/Card';

import { LARGE } from '@util/constants';

interface CarouselContainerProps {
  data: IDiaryContent[];
}

const CarouselContainer = ({ data }: CarouselContainerProps) => {
  const swiperRef = useRef<SwiperClass>();
  const swiperOptions = {
    slideShadows: false,
  };

  return (
    <>
      <section className="flex w-full justify-center">
        <button onClick={() => swiperRef.current?.slidePrev()}>
          <Icon id="largeLeftArrow" size={LARGE} />
        </button>
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="m-10 w-1/2"
          cardsEffect={swiperOptions}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <Card diaryItem={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button onClick={() => swiperRef.current?.slideNext()}>
          <Icon id="largeRightArrow" size={LARGE} />
        </button>
      </section>
    </>
  );
};

export default CarouselContainer;
