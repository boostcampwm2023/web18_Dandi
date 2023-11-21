interface ButtonProps {
  width: number;
  height: number;
  text: string;
  fontColor: string;
  fontSize?: string;
  backgroundColor: string;
  onClick: () => void;
}

const Button = ({
  width,
  height,
  text,
  fontColor,
  fontSize,
  backgroundColor,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`w-[${width}rem] h-[${height}rem] text-${fontColor} font-bold text-${fontSize} bg-${backgroundColor} rounded-lg`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
