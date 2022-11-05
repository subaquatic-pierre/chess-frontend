import React, { useEffect, useState } from 'react';
import { graphql, HeadFC } from 'gatsby';

import Layout from '../layout';

import { INavLink } from '../types/NavLink';

import BoardContainer from '../components/BoardContainer';
import '../static/js/main.ts';
import Controls from '../components/Controls';
import useGameContext from '../hooks/useGameContext';
import GameWrapper from '../components/GameWrapper';

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
      <GameWrapper>
        <Controls />
        <BoardContainer />
      </GameWrapper>
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
