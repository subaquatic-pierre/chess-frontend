import React, { useState } from 'react';
import { Button, Col, FormControl, Row, Container } from 'react-bootstrap';

import useConnectionContext from '../../hooks/useConnectionContext';

import { MessageType, Message } from '../../types/Message';

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { connected, connect, disconnect, username } = useConnectionContext();

  const isAvailableUsername = async (): Promise<string> => {
    // check the username is available before connecting to Web socket
    // const res = await fetch(
    //   `http://localhost:8080/check-username/${inputText}`
    // );
    // const bodyStr: string = await res.json();
    // const body: Message = JSON.parse(bodyStr);
    // if (body.msg_type === MessageType.Error) {
    //   return body.content;
    // }
    return '';
  };

  const handleSubmit = async () => {
    const data = {
      userEmail: email,
      userMessage: message
    };

    console.log('Form Data: ', data);
    try {
      // expecting empty string is username is available
      const notAvailable = await isAvailableUsername();
      if (notAvailable) {
        setError(notAvailable);
      } else {
        // connect(inputText);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event: any) => {
    setMessage(event.target.value);
  };

  return (
    <Row className="mt-5">
      <div className="mb-3">
        <FormControl
          type="text"
          id="email"
          placeholder="Your Email"
          onChange={handleEmailChange}
        />
      </div>
      <div className="mb-3">
        <FormControl
          as="textarea"
          rows={14}
          id="message"
          placeholder="Message"
          onChange={handleMessageChange}
        />
      </div>
      <div>
        {error && (
          <p
            style={{
              marginLeft: 10,
              color: 'red',
              fontSize: '0.8rem'
            }}
          >
            {error}
          </p>
        )}
      </div>
      <div>
        <Button
          className="ml-2"
          css={{ width: '100%' }}
          variant="success"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Row>
  );
};

export default ContactForm;
