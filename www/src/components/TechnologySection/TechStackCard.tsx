import { GatsbyImage, StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { TechStackItem } from '../../types/Tech';
import TechStackListItem from './TechStackListItem';

interface Props {
  title: string;
  items: TechStackItem[];
}

const TechStackCard: React.FC<Props> = ({ title, items }) => {
  return (
    <div className="card mb-4 box-shadow h-100" css={{ minHeight: '100%' }}>
      <div className="card-header">
        <h4 className="my-0 font-weight-normal">{title}</h4>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mt-3 mb-4">
          {items.map((item, idx) => (
            <TechStackListItem
              key={idx}
              lastChild={idx === items.length - 1}
              item={item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TechStackCard;
