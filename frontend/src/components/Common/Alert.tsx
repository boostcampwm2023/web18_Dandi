import Button from './Button';
import '../../globals.css';

interface AlertProps {
  text: string;
}

const Alert = ({ text }: AlertProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <span className="font-bold">{text}</span>
      <div className="flex w-full flex-wrap items-center justify-center gap-5">
        <Button width={8} height={3} text="취소" fontColor="#4B4B4B" backgroundColor="#C7C1BB" />
        <Button width={8} height={3} text="삭제" fontColor="#FFF" backgroundColor="#F96A6A" />
      </div>
    </div>
  );
};

export default Alert;
