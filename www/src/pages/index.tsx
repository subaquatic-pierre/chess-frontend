import React from 'react';
import { graphql, HeadFC } from 'gatsby';

import '../static/js/main.ts';

import { INavLink } from '../types/NavLink';
import { Container } from 'react-bootstrap';

import Layout from '../layout/index';
import ChatContainer from '../components/ChatContainer';
import LobbyControls from '../components/LobbyControls';

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

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <Container>Home Page</Container>
      <LobbyControls />
      <ChatContainer />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC<ISiteMeta> = ({ data }: Props) => (
  <title>{data.site.siteMetadata.title}</title>
);

export const pageQuery = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
