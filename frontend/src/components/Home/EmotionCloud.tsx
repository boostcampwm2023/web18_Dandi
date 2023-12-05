import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordCloudProps {
  emotionData: { text: string; size: number }[];
}

const EmotionCloud = ({ emotionData }: WordCloudProps) => {
  const cloudRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (cloudRef.current && emotionData.length > 0) {
      d3.select(cloudRef.current).selectAll('*').remove();

      const layout = cloud()
        .size([800, 300])
        .words(emotionData)
        .padding(20)
        .spiral('rectangular')
        .rotate(0)
        .font('Impact')
        .fontSize((d) => d.size || 0)
        .on('end', (drawnWords) => {
          const svg = d3.select(cloudRef.current);
          svg
            .selectAll('text')
            .data(drawnWords)
            .enter()
            .append('text')
            .style('font-size', (d) => `${d.size}px`)
            .attr('transform', (d) => `translate(${(d.x || 0) + 400},${(d.y || 0) + 150})`)
            .text((d) => (d.text !== undefined ? d.text : ''));
        });

      layout.start();
    }
  }, [emotionData]);

  return <svg ref={cloudRef} width={800} height={300} />;
};

export default EmotionCloud;
