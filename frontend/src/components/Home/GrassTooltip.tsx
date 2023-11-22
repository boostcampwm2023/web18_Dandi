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
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          style={{ transform: `translateX(calc(-50% - ${scrollLeft}px))` }}
          className="bg-default absolute rounded p-2 text-white opacity-90"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default GrassTooltip;
