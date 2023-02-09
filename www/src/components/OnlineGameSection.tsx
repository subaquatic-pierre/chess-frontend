import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Col, Row, Container } from 'react-bootstrap';

const OnlineGameSection = () => {
  return (
    <section className="jumbotron text-center py-3">
      <Container>
        <Row>
          <Col xs={12} md={6} className="d-flex align-items-center">
            <div
              css={{
                '@media(max-width:800px)': {
                  marginTop: '30px'
                }
              }}
            >
              <h1 className="jumbotron-heading">Play Online &#x1F5FA;</h1>
              <p className="lead text-muted">
                Start a new online chess game or join others around you. The
                online game mode is awesome. Take note that there are currently
                some limitations to online game play. Your game is not saved
                between page refreshes. If you refresh or navigate away from an
                active game you will automatically resign the game.
              </p>
              <div>
                <a href="/lobby" className="btn btn-primary my-2">
                  Online Games
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
                css={{
                  height: 400,
                  borderRadius: '10px',
                  margin: '50px 0px',
                  overflow: 'hidden'
                }}
              >
                <StaticImage
                  style={{ objectFit: 'cover', minHeight: '400px' }}
                  src="../static/images/onlineSection.jpg"
                  alt="Online Game"
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

export default OnlineGameSection;
