import type { GatsbyConfig } from 'gatsby';
import { headerNavLinks } from './src/config/navLinks';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Chess Rust`,
    siteUrl: `https://www.chess-rust.io`,
    headerNavLinks: headerNavLinks
  },
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-remark',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/'
      },
      __key: 'images'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/'
      },
      __key: 'pages'
    }
  ]
};

export default config;
