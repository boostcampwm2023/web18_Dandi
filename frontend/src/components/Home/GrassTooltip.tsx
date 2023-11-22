import { ReactNode, useState } from 'react';

interface GrassTooltipProps {
  content: string;
  scrollLeft: number;
  children: ReactNode;
}

const GrassTooltip = ({ content, scrollLeft, children }: GrassTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className="whitespace-pre"
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute">
          <p
            style={{ transform: `translateX(calc(-50% - ${scrollLeft}px))` }}
            className={`relative -top-16 bg-default rounded p-2 text-white opacity-90`}
          >
            {content}
          </p>
        </div>
      )}
    </div>
  );
};

export default GrassTooltip;
