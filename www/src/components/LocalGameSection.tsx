import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Col, Row, Container } from 'react-bootstrap';

const LocationGameSection = () => {
  return (
    <section className="jumbotron text-center py-3">
      <Container>
        <Row>
          <Col xs={{ order: 2, span: 12 }} md={{ span: 6, order: 1 }}>
            <div
              css={{ height: '100%' }}
              className="d-flex align-items-center justify-content-center"
            >
              <div
                css={{ height: 400, borderRadius: '10px', margin: '50px 0px' }}
              >
                <StaticImage
                  src="../static/images/localSection.jpg"
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
          <Col
            xs={{ order: 1, span: 12 }}
            md={{ span: 6, order: 2 }}
            className="d-flex align-items-center"
          >
            <div>
              <h1 className="jumbotron-heading">Local Games &#x1F3E1;</h1>
              <p className="lead text-muted">
                If you would like to play a local game you can start a new game
                here. All moves made on the local game will be saved. This means
                you can quit, or refresh the page and it will start off from
                your last move. If you would like, you can reset the game from
                the start by hitting the rest button at the top right of the
                game controls within the game page.
              </p>
              <div>
                <a href="/game" className="btn btn-primary my-2">
                  Local Game
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default LocationGameSection;
