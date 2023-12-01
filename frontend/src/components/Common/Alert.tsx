import Button from '@components/Common/Button';

interface AlertProps {
  text: string;
  onUndoButtonClick: () => void;
  onAcceptButtonClick: () => void;
}

const Alert = ({ text, onUndoButtonClick, onAcceptButtonClick }: AlertProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <span className="m-10 text-xl font-bold">{text}</span>
      <div className="flex w-full flex-wrap items-center justify-center gap-16">
        <Button text="취소" type="normal" size="large" onClick={onUndoButtonClick} />
        <Button text="삭제" type="delete" size="large" onClick={onAcceptButtonClick} />
      </div>
    </div>
  );
};

export default Alert;
