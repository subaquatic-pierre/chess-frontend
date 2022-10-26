import React from 'react';
import { useLocation } from '@reach/router';
import { graphql, Link, useStaticQuery } from 'gatsby';

import { Container, Nav, Navbar } from 'react-bootstrap';
import { INavLink } from '../types/NavLink';
import { headerNavLinks } from '../config/navLinks';

const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

const Header = () => {
  const data = useStaticQuery(query);
  const location = useLocation();
  const isActiveLink = (link: string, location: Location): boolean => {
    if (link === location.pathname) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            {data.site.siteMetadata.title}
          </Navbar.Brand>
          <Nav className="ml-auto">
            {headerNavLinks.map((item: INavLink, idx: number) => (
              <Nav.Link
                as={Link}
                key={idx}
                to={item.link}
                className={isActiveLink(item.link, location) ? 'active' : ''}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
