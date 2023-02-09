import React from 'react';

import { Container } from 'react-bootstrap';
import ContactForm from './ContactForm';

const ContactContainer = () => {
  return (
    <div
      css={{
        padding: '0px 10px',
        minHeight: 'calc(100vh - 132px)',
        backgroundColor: '#f1eded',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="card"
        css={{
          padding: '20px 10px 50px 10px',
          // minWidth: 800,
          minWidth: 'calc(100hw - 10px)',
          '@media(min-width:800px)': {
            minWidth: 700,
            padding: '20px 30px 50px 30px'
          }
        }}
      >
        {/* Heading */}
        <div className="d-flex flex-column align-items-center">
          <h1 className="display-4">Contact Us</h1>
          <div
            css={{
              backgroundColor: 'black',
              height: 1,
              width: '50%',
              marginTop: 10
            }}
          />
        </div>
        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactContainer;
