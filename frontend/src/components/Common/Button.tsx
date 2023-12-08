interface ButtonProps {
  text: string;
  type: 'default' | 'delete' | 'normal';
  size?: 'large';
  onClick: () => void;
}

const Button = ({ text, type, size, onClick }: ButtonProps) => {
  const buttonClass = `btn btn-${type}${size === 'large' ? ' btn-large' : ''}`;
  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
