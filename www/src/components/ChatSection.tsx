import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Col, Row, Container } from 'react-bootstrap';

const ChatSection = () => {
  return (
    <section className="jumbotron text-center my-5 py-5">
      <Container>
        <Row>
          <Col xs={12} md={6} className="d-flex align-items-center">
            <div>
              <h1 className="jumbotron-heading">Chat Arena &#x1F4AC;</h1>
              <p className="lead text-muted">
                If you do not have anyone to play with yet, you can join the
                chat arena. You will be able to chat with people who are also
                interested in playing chess. You can start a conversation with
                someone who is interested in playing at which point you can
                create a new game or join their game.
              </p>
              <div>
                <a href="/chat" className="btn btn-primary my-2">
                  Chat Arena
                </a>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div
              css={{ height: '100%' }}
              className="d-flex align-items-center justify-content-center"
            >
              <div
                css={{ height: 400, borderRadius: '10px', margin: '50px 0px' }}
              >
                <StaticImage
                  src="../static/images/chatSection.jpg"
                  alt="Online Game"
                  style={{ objectFit: 'cover', minHeight: '400px' }}
                  imgStyle={{
                    borderRadius: '10px',
                    maxWidth: '100%',
                    minHeight: '400px',
                    maxHeight: '400px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ChatSection;
