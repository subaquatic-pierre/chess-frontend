import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { backendTechItems, frontendTechItems } from './data';
import TechStackCard from './TechStackCard';

const TechnologySection = () => {
  return (
    <section className="jumbotron text-center pb-5">
      <Container>
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <h1 className="display-4">Technologies</h1>
          <div className="d-flex justify-content-center">
            <p css={{ maxWidth: 800 }} className="lead">
              Below you will find a list of technologies used throughout the
              project. The tech stacks are split into frontend and backend
              technologies. The are listed in no particular order.
            </p>
          </div>
        </div>

        {/* Cards */}

        <Row>
          <Col xs={12} md={6}>
            <TechStackCard title="Frontend" items={frontendTechItems} />
          </Col>
          <Col xs={12} md={6} css={{ minHeight: '100%' }}>
            <TechStackCard title="Backend" items={backendTechItems} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TechnologySection;
