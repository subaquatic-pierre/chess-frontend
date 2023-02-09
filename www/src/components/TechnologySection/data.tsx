import React from 'react';
import { GatsbyImage, StaticImage } from 'gatsby-plugin-image';

import { IGatsbyImageData } from 'gatsby-plugin-image';
import { TechStackItem } from '../../types/Tech';

export const backendTechItems: TechStackItem[] = [
  {
    title: 'Rust Programming Language',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/rust.png"
      />
    ),
    content: `The main backend server is written in the Rust programming language.
    Strongly typed, compiled language with near C programming language speed.
      `,
    imageSrc: '/images/tech/rust.png'
  },
  {
    title: 'Actix Web',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/actix.png"
      />
    ),
    content: `A web server API framework written in the Rust programming language. 
      It has benchmarked regularly as one of the fastest web server frameworks.
      `,
    imageSrc: '/images/tech/actix.png'
  },
  {
    title: 'Web Sockets',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/websocket.svg"
      />
    ),
    content: `Web socket have been employed in the backend to support real time 
    communication between client and server. Regular HTTP protocol endpoints are also
    available.
      `,
    imageSrc: '/images/tech/websocket.svg'
  }
];
export const frontendTechItems: TechStackItem[] = [
  {
    title: 'Web Assembly',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/wasm.png"
      />
    ),
    content: `The latest Web Assembly technology is employed to speed up the application.
    The WASM has been compiled from Rust source code, using "wasm-bindgen".
      `,
    imageSrc: '/images/tech/wasm.png'
  },
  {
    title: 'React',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/react.png"
      />
    ),
    content: `The frontend is developed with extendable React TS components.
    Enabling easy state management and scalability.
      `,
    imageSrc: '/images/tech/react.png'
  },
  {
    title: 'Gatsby',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/gatsby.png"
      />
    ),
    content: `Gatsby is a frontend single page application development API framework.
    It has enabled us to make fast iterations and easily compile our frontend source into
    a minimized web package for easy deployment.
      `,
    imageSrc: '/images/tech/gatsby.png'
  },
  {
    title: 'Typescript',
    image: (
      <StaticImage
        imgStyle={{ width: '100%' }}
        alt="Dummy"
        src="../../static/images/typescript.png"
      />
    ),
    content: `The entire Gatsby / React application is written in Typescript, this
    has allowed for clearer code.
      `,
    imageSrc: '/images/tech/typescript.png'
  }
];
