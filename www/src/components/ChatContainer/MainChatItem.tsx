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
import useConnectionContext from '../../hooks/useConnectionContext';
import { Message, MessageType } from '../../types/Message';

import { INFO, SELF, OTHER, STATUS, ERROR } from '../../theme';

interface MainChatItemProps {
  chatMessage: Message;
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
      return `Error formatting message in MainChatItem: ${msg}`;
  }
};

const formatMessageColor = (msg: Message): string => {
  const { username } = useConnectionContext();
  switch (msg.msg_type) {
    case MessageType.Status:
      return STATUS;

    case MessageType.Command:
      return INFO;

    case MessageType.Error:
      return ERROR;

    case MessageType.ClientMessage:
      if (msg.username === 'me') {
        return SELF;
      } else {
        return OTHER;
      }

    default:
      return '';
  }
};

const MainChatItem: React.FC<MainChatItemProps> = ({ chatMessage }) => {
  const theme = useTheme();
  const styles = {
    borderRadius: '0'
  };
  return (
    <ListGroupItem style={styles}>
      <p
        style={{
          padding: 0,
          margin: 0,
          color: formatMessageColor(chatMessage)
        }}
      >
        {formatMessageString(chatMessage)}
      </p>
    </ListGroupItem>
  );
};

export default MainChatItem;
