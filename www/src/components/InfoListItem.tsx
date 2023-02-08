import { useTheme } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Col,
  Container,
  Row,
  ListGroup,
  ListGroupItem,
  FormText,
  FormControl
} from 'react-bootstrap';
import useConnectionContext from '../hooks/useConnectionContext';
import { Message, MessageType } from '../types/Message';

import { INFO, SELF, OTHER, STATUS, ERROR } from '../theme';

interface MainChatItemProps {
  message: Message;
}

const formatMessageString = (msg: Message): string => {
  const { username } = useConnectionContext();
  switch (msg.msg_type) {
    case MessageType.Status:
      return `${msg.content}`;

    case MessageType.ClientMessage:
      return `${msg.username}: ${msg.content}`;

    case MessageType.Command:
      return `> ${msg.content}`;

    case MessageType.Error:
      return `# ${msg.content}`;

    default:
      return `${msg.content}`;
  }
};

const formatMessageColor = (msg: Message): string => {
  switch (msg.msg_type) {
    case MessageType.Status:
      return STATUS;

    case MessageType.Command:
      return INFO;

    case MessageType.Error:
      return ERROR;

    default:
      return '';
  }
};

const InfoListItem: React.FC<MainChatItemProps> = ({ message }) => {
  const theme = useTheme();
  const styles = {
    borderRadius: '0'
  };
  return (
    <ListGroupItem style={styles}>
      {/* <p
        style={{
          padding: 0,
          margin: 0,
          color: formatMessageColor(message)
        }}
      > */}
      <pre
        style={{
          padding: 0,
          margin: 0,
          color: formatMessageColor(message)
        }}
      >
        {JSON.stringify(message, null, 2)}
      </pre>
      {/* {formatMessageString(message)} */}
      {/* </p> */}
    </ListGroupItem>
  );
};

export default InfoListItem;
