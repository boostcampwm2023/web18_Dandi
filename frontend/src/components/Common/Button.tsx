import '../../globals.css';

interface ButtonProps {
  width: number;
  height: number;
  text: string;
  fontColor: string;
  backgroundColor: string;
}

const Button = ({ width, height, text, fontColor, backgroundColor }: ButtonProps) => {
  return (
    <button
      className={`w-[${width}rem] h-[${height}rem] text-${fontColor} font-bold bg-[${backgroundColor}] rounded-lg`}
    >
      {text}
    </button>
  );
};

export default Button;
