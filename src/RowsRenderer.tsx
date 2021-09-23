import React from 'react';
import { Box } from '@mui/material';
import { Layer, Rect, Stage } from 'react-konva';
import * as Konva from 'konva';
import { Size } from './types';
import { colCount } from './App';

const cellSize = 4;
const gridSize = 5;

interface Props {
  rows: number[][];
  colors: string[];
}

const RowsRenderer: React.FC<Props> = (props) => {
  const { rows, colors } = props;
  const containerRef = React.useRef<HTMLDivElement>();
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 });
  const containerCallbackRef = React.useCallback((node: HTMLDivElement): void => {
    if (node) {
      containerRef.current = node;
      const { width, height } = node.getBoundingClientRect();
      setSize({ width, height });
    }
  }, []);
  const stageRef = React.useRef<Konva.default.Stage | null>();
  const stageCallbackRef = React.useCallback((stage: Konva.default.Stage): void => {
    stageRef.current = stage;
  }, []);

  React.useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    window.addEventListener('resize', measure);
    measure();

    const scroll = () => {
      if (containerRef.current && stageRef.current) {
        const dx = containerRef.current.scrollLeft;
        const dy = containerRef.current.scrollTop;
        stageRef.current.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        stageRef.current.x(-dx);
        stageRef.current.y(-dy);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', scroll);
    }

    return () => window.removeEventListener('resize', measure);
  }, []);

  const containerSize: Size = { width: colCount * gridSize, height: ((colCount + 1) * gridSize) / 2 };

  return (
    <div
      ref={containerCallbackRef}
      style={{ width: 'calc(100vw - 232px)', height: 'calc(100vh - 144px)', overflow: 'auto' }}
    >
      <Box sx={{ ...containerSize, overflow: 'hidden' }}>
        <Stage ref={stageCallbackRef} {...size}>
          <Layer>
            {rows.map((row, r) =>
              row.map((colorIndex, c) => (
                <Rect
                  key={`${r}-${c}`}
                  width={cellSize}
                  height={cellSize}
                  x={gridSize * (c + r)}
                  y={gridSize * r}
                  cornerRadius={1}
                  fill={colors[colorIndex]}
                />
              ))
            )}
          </Layer>
        </Stage>
      </Box>
    </div>
  );
};

export default RowsRenderer;
