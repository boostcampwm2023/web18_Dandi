import leftArrow from '@assets/image/leftArrow.svg';
import rightArrow from '@assets/image/rightArrow.svg';

interface DateControllerProp {
  titles: string[];
  leftOnClick: () => void;
  rightOnClick: () => void;
}

const DateController = ({ titles, leftOnClick, rightOnClick }: DateControllerProp) => {
  return (
    <>
      <div className="mb-8 flex w-72 justify-between gap-3.5">
        <img src={leftArrow} onClick={leftOnClick} className="cursor-pointer" />
        <div className="text-center">
          {titles.map((title, index) => (
            <p key={index} className="first:mb-1 first:text-2xl first:font-bold last:text-base">
              {title}
            </p>
          ))}
        </div>

        <img src={rightArrow} onClick={rightOnClick} className="cursor-pointer" />
      </div>
    </>
  );
};

export default DateController;
