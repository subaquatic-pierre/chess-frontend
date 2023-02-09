import React from 'react';
import { navigate } from 'gatsby';
import useConnectionContext from '../hooks/useConnectionContext';
import ConnectControl from './ConnectControl';

const IndexHero = () => {
  const { connected, username } = useConnectionContext();
  return (
    <div
      css={{ padding: '100px 0', backgroundColor: '#f1eded' }}
      className="jumbotron"
    >
      <div
        className="container"
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h1 className="display-3 mb-3">Chess with Rust</h1>
        <div css={{ maxWidth: 700 }}>
          <p className="lead">
            Welcome to chess with Rust. This project is still in its beta phase.
            The point of the project is to have fun playing chess with your
            online friends or at home with your family. &#x1F600;
          </p>
          {/* <p className="lead">
            The project also demonstrates the flexibility of Rust with WASM ans
            React JS. Please send us a message from the{' '}
            <span
              css={{
                color: 'blue',
                textDecoration: 'underline',
                '&:hover': { cursor: 'pointer', color: 'inherit' }
              }}
              onClick={() => navigate('/contact')}
            >
              contact page
            </span>{' '}
            if you notice any bugs or would like to contribute to the project.
            You can also check out the source code at our{' '}
            <a
              target="_blank"
              css={{ color: 'blue', textDecoration: 'underline' }}
              href="https://github.com/subaquatic-pierre/chess-project"
            >
              Github
            </a>{' '}
            project. You can also check out the technologies used at the bottom
            of this page.
          </p> */}
          {connected ? (
            <p>
              You are logged in as: <b>{username}</b>
            </p>
          ) : (
            <div>
              <p>
                Enter a username below to start using the online features such
                as chat or online game play.
              </p>
              <ConnectControl />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexHero;
