import React from 'react';
import { useLocation } from '@reach/router';
import { graphql, Link, useStaticQuery } from 'gatsby';

import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { INavLink } from '../types/NavLink';
import { headerNavLinks } from '../config/navLinks';
import useConnectionContext from '../hooks/useConnectionContext';

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
  const { connected, disconnect } = useConnectionContext();
  const data = useStaticQuery(query);
  const location = useLocation();

  const isActiveLink = (link: string, location: Location): boolean => {
    const _link = link === '/' ? '/' : `${link}/`;
    if (_link === location.pathname) {
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
    <div css={{ height: 56 }}>
      <Navbar bg="dark" fixed="top" variant="dark">
        <Container>
          <Navbar.Brand href="/">{data.site.siteMetadata.title}</Navbar.Brand>
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
            {/* Right Side of controls when connected */}
            {connected && (
              <div css={{ display: 'flex', marginLeft: 20 }}>
                <Button variant="danger" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
