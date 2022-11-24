import React, { useEffect, useState } from 'react';

import { getBorderLabels } from '../util/board';
import { BorderSide } from '../types/Board';
import { TILE_SPACE } from '../types/Board';
import useBoardContext from '../hooks/useBoardContext';

interface Props {
  side: BorderSide;
}

interface BorderProps {
  label: string;
}

const VertBorderTile: React.FC<BorderProps> = ({ label }) => {
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& p': { margin: 0 }
      }}
    >
      <p>{label}</p>
    </div>
  );
};

const HorizontalBorder: React.FC<Props> = ({ side }) => {
  const { boardDirection } = useBoardContext();
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const labels = getBorderLabels(boardDirection, side);
    setLabels(labels);
  }, [boardDirection]);

  return (
    <div
      css={{
        marginLeft: side === BorderSide.Left ? 'auto' : 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 30px)',
        gridGap: TILE_SPACE
      }}
    >
      {labels.map((label, idx) => (
        <VertBorderTile label={label} key={idx} />
      ))}
    </div>
  );
};

export default HorizontalBorder;
