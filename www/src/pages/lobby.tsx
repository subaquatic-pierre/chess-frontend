import React, { useEffect } from 'react';
import { graphql, HeadFC } from 'gatsby';
import { Container } from 'react-bootstrap';

import Layout from '../layout/index';
import { INavLink } from '../types/NavLink';

interface ISiteMeta {
  site: {
    siteMetadata: {
      title: string;
      headerNavLinks: INavLink[];
    };
  };
}

interface Props {
  data: ISiteMeta;
}

const LobbyPage: React.FC = () => {
  return (
    <Layout>
      <Container>Lobby Page</Container>
    </Layout>
  );
};

export default LobbyPage;

export const Head: HeadFC<ISiteMeta> = ({ data }: Props) => (
  <title>{data.site.siteMetadata.title}</title>
);

export const pageQuery = graphql`
  query LobbyPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
