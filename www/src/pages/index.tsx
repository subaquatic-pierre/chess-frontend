import React, { useState } from 'react';
import { graphql, HeadFC } from 'gatsby';
import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';

import '../static/js/main.ts';

import { INavLink } from '../types/NavLink';
import { useLocation } from '@reach/router';

import useChatContext from '../hooks/useChatContext';
import useConnectionContext from '../hooks/useConnectionContext';

import { MessageType, Message } from '../types/Message';

function makeId() {
  return Math.random().toString(36).slice(2, 7);
}

import Layout from '../layout/index';
import ChatContainer from '../components/ChatContainer/ChatContainer';
import ChatControls from '../components/ChatContainer/ChatControls';
import ChatContextProvider from '../context/ChatContext';
import ConnectControl from '../components/ConnectControl';
import IndexHero from '../components/IndexHero';

import OnlineGameSection from '../components/OnlineGameSection';
import LocalGameSection from '../components/LocalGameSection';
import ChatSection from '../components/ChatSection';
import TechnologySection from '../components/TechnologySection/TechnologySection';
import ContactSection from '../components/ContactSection';

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
      <IndexHero />
      <OnlineGameSection />
      <LocalGameSection />
      <ChatSection />
      <TechnologySection />
      <ContactSection />
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
