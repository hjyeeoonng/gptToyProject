import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 300px;
  height: 400px;
  background-color: #4CAF50; /* 헤더와 유사한 색상 */
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background-color: #388E3C;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 1.2rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #388E3C;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const SendButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const MessageBubble = styled.div`
  background-color: white;
  color: #333;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 10px;
  max-width: 80%;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isUser: true }]);
      setInputValue('');
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>채팅</ChatHeader>
      <ChatMessages>
        {messages.map((msg, index) => (
          <MessageBubble key={index} isUser={msg.isUser}>
            {msg.text}
          </MessageBubble>
        ))}
      </ChatMessages>
      <ChatInputContainer>
        <ChatInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <SendButton onClick={handleSend}>전송</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

export default ChatWindow;