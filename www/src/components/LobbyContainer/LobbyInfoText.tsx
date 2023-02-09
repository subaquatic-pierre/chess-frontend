import React from 'react';

interface Props {
  content: string;
}

const InfoItem: React.FC<Props> = ({ content }) => (
  <li className="d-flex align-items-center py-2">
    <span css={{ marginRight: 10 }}>&#10145;</span>{' '}
    <p css={{ margin: 0 }}>{content}</p>
  </li>
);

const LobbyInfoText = () => {
  return (
    <div css={{ padding: '20px 0px' }}>
      <h1 className="jumbotron-heading text-center mb-4">
        Play Online &#x2754;
      </h1>
      <p className="lead text-center text-muted">
        Please read the below information before starting a game. Click on a
        game from the available games on the left then click "Join" in the list
        box to join an available game, or start a new game by clicking the "New
        Game" button.
      </p>
      <div className="card mb-4 box-shadow my-4">
        <div className="card-header">
          <h4 className="my-0 font-weight-normal"> &#x2757; Notes:</h4>
        </div>
        <div className="card-body">
          <ul className="list-unstyled my-2">
            <InfoItem content="Joining an available game will make you the black pieces." />
            <InfoItem content="Starting a new game, will make you the white pieces." />
            <InfoItem content="Refreshing or navigating away from the game will cause you to forfeit the match." />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbyInfoText;
