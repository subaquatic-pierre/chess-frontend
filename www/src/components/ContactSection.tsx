import React from 'react';
import { navigate } from 'gatsby';
import { Container, Button } from 'react-bootstrap';

const ContactSection = () => {
  return (
    <Container>
      <div
        className="jumbotron"
        css={{
          padding: '20px',
          '@media(min-width: 800px)': {
            padding: '50px'
          },
          margin: '50px 0px 100px 0px',
          backgroundColor: '#f1eded',
          borderRadius: '10px'
        }}
      >
        <h1 className="mb-4">Contact Us &#x1F44B;</h1>
        <p className="lead mb-4">
          This project demonstrates the flexibility of Rust with WASM and React
          JS. If you have any comments of bugs please send us a message from the{' '}
          <span
            css={{
              color: 'blue',
              textDecoration: 'underline',
              '&:hover': { cursor: 'pointer', color: 'inherit' }
            }}
            onClick={() => navigate('/contact')}
          >
            contact page
          </span>
          . You can also check out the source code on{' '}
          <a
            target="_blank"
            css={{ color: 'blue', textDecoration: 'underline' }}
            href="https://github.com/subaquatic-pierre/chess-project"
          >
            Github
          </a>
          .
        </p>
        <div className="d-flex justify-content-center">
          <Button
            onClick={() => navigate('/contact')}
            role="button"
            variant="info"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ContactSection;
