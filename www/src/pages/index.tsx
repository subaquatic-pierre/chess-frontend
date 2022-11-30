import React from 'react';
import { graphql, HeadFC } from 'gatsby';

import '../static/js/main.ts';

import { INavLink } from '../types/NavLink';

import Layout from '../layout/index';
import BoardContainer from '../components/BoardContainer';
import Controls from '../components/Controls';
import useGameContext from '../hooks/useGameContext';
import GameContainer from '../components/GameContainer';
import MovesContainer from '../components/MovesContainer';

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
      <GameContainer>
        <Controls />
        <BoardContainer />
        <MovesContainer />
      </GameContainer>
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
