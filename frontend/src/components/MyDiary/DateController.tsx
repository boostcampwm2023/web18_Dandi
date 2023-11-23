import Icon from '@components/Common/Icon';

interface DateControllerProp {
  titles: string[];
  leftOnClick: () => void;
  rightOnClick: () => void;
}

const DateController = ({ titles, leftOnClick, rightOnClick }: DateControllerProp) => {
  return (
    <>
      <div className="mb-8 flex w-72 items-center justify-between gap-3.5">
        <button onClick={leftOnClick}>
          <Icon id="leftArrow" />
        </button>
        <div className="text-center">
          {titles.map((title, index) => (
            <p key={index} className="first:mb-1 first:text-2xl first:font-bold last:text-base">
              {title}
            </p>
          ))}
        </div>
        <button onClick={rightOnClick}>
          <Icon id="rightArrow" />
        </button>
      </div>
    </>
  );
};

export default DateController;
