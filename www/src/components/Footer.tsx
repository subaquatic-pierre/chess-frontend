import React from 'react';
import { useLocation } from '@reach/router';
import { graphql, Link, useStaticQuery } from 'gatsby';

import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { INavLink } from '../types/NavLink';
import { headerNavLinks } from '../config/navLinks';
import useConnectionContext from '../hooks/useConnectionContext';
import { StaticImage } from 'gatsby-plugin-image';

const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

const Footer = () => {
  const { connected, disconnect } = useConnectionContext();
  const data = useStaticQuery(query);
  const location = useLocation();

  const isActiveLink = (link: string, location: Location): boolean => {
    if (link === location.pathname) {
      return true;
    } else {
      return false;
    }
  };

  const handleDisconnect = () => {
    disconnect();

    window.sessionStorage.removeItem('savedUsername');
    window.location.assign('/');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">{data.site.siteMetadata.title}</Navbar.Brand>
          <Nav className="ml-auto">
            <a
              target="_blank"
              href="https://github.com/subaquatic-pierre/chess-project"
              css={{ width: '50px', paddingTop: 10 }}
            >
              <StaticImage
                imgStyle={{ maxWidth: '100%' }}
                backgroundColor="transparent"
                src="../static/images/github.png"
                alt="Github Logo"
              />
            </a>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Footer;
