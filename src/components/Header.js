import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #4CAF50; /* 체스와 어울리는 짙은 녹색 */
  color: white;
  text-align: center;
  padding: 24px; /* 패딩을 줄여서 헤더를 얇게 만듭니다 */
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem; /* 글씨 크기를 키웁니다 */
  margin: 0; /* 추가적인 마진을 없애 깔끔하게 만듭니다 */
`;


const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const RoundedButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: ${props => props.selected ? '#a0a080' : '#f5f5e6'};
  color: black;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.selected ? '#b1b1a1' : '#e0e0d1'};
  }
`;

const Header = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };
  return (
    <HeaderContainer>
      <Title>아이들을 위한 체스 친구</Title>
      <ButtonContainer>
      <RoundedButton
          selected={selectedButton === '상'}
          onClick={() => handleButtonClick('상')}
        >
          상
        </RoundedButton>
        <RoundedButton
          selected={selectedButton === '중'}
          onClick={() => handleButtonClick('중')}
        >
          중
        </RoundedButton>
        <RoundedButton
          selected={selectedButton === '하'}
          onClick={() => handleButtonClick('하')}
        >
          하
        </RoundedButton>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default Header;