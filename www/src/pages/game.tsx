import React from 'react';
import { graphql, HeadFC } from 'gatsby';

import '../static/js/main.ts';

import { INavLink } from '../types/NavLink';

import Layout from '../layout/index';
import GameContainer from '../components/GameContainer/GameContainer';

import GameContextProvider from '../context/GameContext';
import BoardContextProvider from '../context/BoardContext';

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

const GamePage: React.FC = () => {
  return (
    <Layout>
      <GameContextProvider>
        <BoardContextProvider>
          <GameContainer />
        </BoardContextProvider>
      </GameContextProvider>
    </Layout>
  );
};

export default GamePage;

export const Head: HeadFC<ISiteMeta> = ({ data }: Props) => (
  <title>{data.site.siteMetadata.title}</title>
);

export const pageQuery = graphql`
  query GamePageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
