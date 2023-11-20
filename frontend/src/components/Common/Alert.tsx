import Button from '@components/Common/Button';

interface AlertProps {
  text: string;
  onUndoButtonClick: () => void;
  onAcceptButtonClick: () => void;
}

const Alert = ({ text, onUndoButtonClick, onAcceptButtonClick }: AlertProps) => {

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <span className="font-bold">{text}</span>
      <div className="flex w-full flex-wrap items-center justify-center gap-5">
        <Button
          width={8}
          height={3}
          text="취소"
          fontColor="default"
          backgroundColor="brown"
          onClick={onUndoButtonClick}
        />
        <Button
          width={8}
          height={3}
          text="삭제"
          fontColor="white"
          backgroundColor="red"
          onClick={onAcceptButtonClick}
        />
      </div>
    </div>
  );
};

export default Alert;
