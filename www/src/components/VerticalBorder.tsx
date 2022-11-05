import React, { useEffect, useState } from 'react';
import useGameContext from '../hooks/useGameContext';
import { getBorderLabels } from '../util/board';
import { BorderSide } from '../types/Board';
import { TILE_SPACE } from '../types/Board';

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

const VerticalBorder: React.FC<Props> = ({ side }) => {
  const { boardDirection } = useGameContext();
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const labels = getBorderLabels(boardDirection, side);
    setLabels(labels);
  }, [boardDirection]);

  return (
    <>
      <div />
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, auto)',
          gridGap: TILE_SPACE
        }}
      >
        {labels.map((label, idx) => (
          <VertBorderTile label={label} key={idx} />
        ))}
      </div>
      <div />
    </>
  );
};

export default VerticalBorder;
