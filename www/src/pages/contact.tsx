import React, { useEffect } from 'react';
import { graphql, HeadFC } from 'gatsby';

import Layout from '../layout/index';
import { INavLink } from '../types/NavLink';
import ContactContainer from '../components/ContactContainer/ContactContainer';

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
  return (
    <Layout>
      <ContactContainer />
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
