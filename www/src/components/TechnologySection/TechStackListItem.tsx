import React from 'react';
import { TechStackItem } from '../../types/Tech';

interface Props {
  item: TechStackItem;
  lastChild?: boolean;
}

const TechStackListItem: React.FC<Props> = ({
  item: { title, content, image, imageSrc },
  lastChild
}) => {
  return (
    <li
      css={{
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div className="d-flex justify-content-center align-items-center">
        <div
          css={{
            minWidth: 50,
            maxWidth: 50,
            marginRight: 20
          }}
        >
          {image}
          {/* <img
            css={{
              width: '100%'
            }}
            src={imageSrc}
            alt={title}
          /> */}
        </div>
        <div css={{ paddingRight: 10 }}>
          <h5>{title}</h5>
          <p css={{ textAlign: 'start' }}>{content}</p>
          {!lastChild && (
            <div
              css={{
                height: '1px',
                backgroundColor: '#b8b4b4',
                marginTop: 10
              }}
            />
          )}
        </div>
      </div>
    </li>
  );
};

export default TechStackListItem;
