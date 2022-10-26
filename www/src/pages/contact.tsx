import React, { useEffect } from 'react';
import { graphql, HeadFC } from 'gatsby';

import Layout from '../layout';
import CarContainer from '../components/CarContainer';

import { run } from 'wasm-gatsby-lib';
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

const ContactPageQuery: React.FC = () => {
  useEffect(() => {
    run();
  }, []);

  return (
    <Layout>
      <CarContainer />
    </Layout>
  );
};

export default ContactPageQuery;

export const Head: HeadFC<ISiteMeta> = ({ data }: Props) => (
  <title>{data.site.siteMetadata.title}</title>
);

export const pageQuery = graphql`
  query ContactPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
