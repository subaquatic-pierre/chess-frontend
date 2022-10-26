import React, { useEffect } from 'react';
import { graphql, HeadFC } from 'gatsby';

import Layout from '../layout';
import CarContainer from '../components/CarContainer';

import { run } from 'wasm-gatsby-lib';
import { PageProps } from 'gatsby';
import { INavLink } from '../types/NavLink';
import RustContainer from '../components/RustContainer';

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
  useEffect(() => {
    run();
  }, []);

  return (
    <Layout>
      <CarContainer />
      <RustContainer />
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
