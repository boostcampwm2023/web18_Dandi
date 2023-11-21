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
      <div className="flex w-56 justify-between gap-3.5">
        <img src={leftArrow} onClick={leftOnClick} className="cursor-pointer" />
        {titles.map((title, index) => (
          <p key={index} className="text-2xl font-bold">
            {title}
          </p>
        ))}
        <img src={rightArrow} onClick={rightOnClick} className="cursor-pointer" />
      </div>
    </>
  );
};

export default DateController;
