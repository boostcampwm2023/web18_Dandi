import { ReactNode, useState, useEffect, useRef } from 'react';

interface GrassTooltipProps {
  content: string;
  children: ReactNode;
}

const GrassTooltip = ({ content, children }: GrassTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const grassDiv = useRef<HTMLDivElement>(null);
  const tooltipDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grassNode = grassDiv.current;

    if (grassNode) {
      const rect = grassNode.getBoundingClientRect();
      if (tooltipDiv.current) {
        tooltipDiv.current.style.left = `${rect.left}px`;
      }
    }
  }, [showTooltip]);

  return (
    <div
      ref={grassDiv}
      className="whitespace-pre"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          ref={tooltipDiv}
          className="bg-default absolute -translate-x-1/2 rounded p-2 text-white opacity-90"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default GrassTooltip;
