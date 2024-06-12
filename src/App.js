import React, { useState } from 'react';
import styled from 'styled-components';
import './App.css';

import Header from './components/Header';
import ChatWindow from './components/ChatWindow';

import whitePawn from './images/white_pawn.png';
import whiteQueen from './images/white_queen.png';
import whiteKing from './images/white_king.png';
import whiteBishop from './images/white_bishop.png';
import whiteKnight from './images/white_knight.png';
import whiteRook from './images/white_rook.png';

import blackPawn from './images/black_pawn.png';
import blackQueen from './images/black_queen.png';
import blackKing from './images/black_king.png';
import blackBishop from './images/black_bishop.png';
import blackKnight from './images/black_knight.png';
import blackRook from './images/black_rook.png';

const Body = styled.div`
  height: 100vh;
  width: 100vw;
  background: #f5f5e6;
`;

const BoardBox = styled.div`
  width: 100vw;
  display: flex;
`;

const BoardContainer = styled.div`
  width: 640px;
  height: 640px;
  margin: 60px 30px;
  border: 2px solid black;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Square = styled.div`
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.dark ? '#769656' : '#eeeed2')};
  flex-shrink: 0;
  border: ${props => (props.selected ? '3px solid red' : 'none')};
`;

const Piece = styled.img`
  width: 80%;
  height: 80%;
  cursor: pointer;
`;

const HelpButton = styled.button`
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  word-wrap: break-word;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 24px;
`;

const initialSetup = [
  ['Brook', 'Bknight', 'Bbishop', 'Bqueen', 'Bking', 'Bbishop', 'Bknight', 'Brook'],
  ['Bpawn', 'Bpawn', 'Bpawn', 'Bpawn', 'Bpawn', 'Bpawn', 'Bpawn', 'Bpawn'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['Wpawn', 'Wpawn', 'Wpawn', 'Wpawn', 'Wpawn', 'Wpawn', 'Wpawn', 'Wpawn'],
  ['Wrook', 'Wknight', 'Wbishop', 'Wqueen', 'Wking', 'Wbishop', 'Wknight', 'Wrook']
];



const pieceImages = {
  'Wpawn': whitePawn,
  'Wqueen': whiteQueen,
  'Wking': whiteKing,
  'Wknight': whiteKnight,
  'Wbishop': whiteBishop,
  'Wrook': whiteRook,
  'Bpawn': blackPawn,
  'Bqueen': blackQueen,
  'Bking': blackKing,
  'Bknight': blackKnight,
  'Bbishop': blackBishop,
  'Brook': blackRook,
};

const parseMove = (move) => {
  if (!move || move.length !== 1) return [null, null];
  const col = move[0].charCodeAt(0) - 97; // 'a'의 ASCII 값은 97
  const row = 8 - parseInt(move[0][1], 10); // '8'은 체스판의 첫 번째 행
  return [row, col];
};

function App() {
  const [board, setBoard] = useState(initialSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [turn, setTurn] = useState('W');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isGameOver, setIsGameOver] = useState(true);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const isValidMove = (piece, fromRow, fromCol, toRow, toCol) => {
    if (piece[1] === 'p') {
      // Pawn movement logic
      if (piece[0] === 'W') {
        if (fromCol === toCol && !board[toRow][toCol]) {
          if (fromRow === 6 && toRow === 4 && !board[5][toCol]) return true;
          if (toRow === fromRow - 1) return true;
        } else if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow - 1 && board[toRow][toCol] && board[toRow][toCol][0] === 'B') {
          return true;
        }
      } else {
        if (fromCol === toCol && !board[toRow][toCol]) {
          if (fromRow === 1 && toRow === 3 && !board[2][toCol]) return true;
          if (toRow === fromRow + 1) return true;
        } else if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + 1 && board[toRow][toCol] && board[toRow][toCol][0] === 'W') {
          return true;
        }
      }
    } else if (piece[1] === 'r') {
      // Rook movement logic
      if (fromRow === toRow || fromCol === toCol) {
        const stepRow = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
        const stepCol = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
        let r = fromRow + stepRow;
        let c = fromCol + stepCol;
        while (r !== toRow || c !== toCol) {
          if (board[r][c]) return false;
          r += stepRow;
          c += stepCol;
        }
        return !board[toRow][toCol] || board[toRow][toCol][0] !== piece[0];
      }
    } else if (piece[1] === 'k' && piece[2] === 'n') {
      // Knight movement logic
      const rowDiff = Math.abs(fromRow - toRow);
      const colDiff = Math.abs(fromCol - toCol);
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2) &&
             (!board[toRow][toCol] || board[toRow][toCol][0] !== piece[0]);
    } else if (piece[1] === 'b') {
      // Bishop movement logic
      if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        const stepRow = toRow > fromRow ? 1 : -1;
        const stepCol = toCol > fromCol ? 1 : -1;
        let r = fromRow + stepRow;
        let c = fromCol + stepCol;
        while (r !== toRow || c !== toCol) {
          if (board[r][c]) return false;
          r += stepRow;
          c += stepCol;
        }
        return !board[toRow][toCol] || board[toRow][toCol][0] !== piece[0];
      }
    } else if (piece[1] === 'q') {
      // Queen movement logic
      if (fromRow === toRow || fromCol === toCol) {
        // Rook-like movement
        const stepRow = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
        const stepCol = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
        let r = fromRow + stepRow;
        let c = fromCol + stepCol;
        while (r !== toRow || c !== toCol) {
          if (board[r][c]) return false;
          r += stepRow;
          c += stepCol;
        }
        return !board[toRow][toCol] || board[toRow][toCol][0] !== piece[0];
      } else if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        // Bishop-like movement
        const stepRow = toRow > fromRow ? 1 : -1;
        const stepCol = toCol > fromCol ? 1 : -1;
        let r = fromRow + stepRow;
        let c = fromCol + stepCol;
        while (r !== toRow || c !== toCol) {
          if (board[r][c]) return false;
          r += stepRow;
          c += stepCol;
        }
        return !board[toRow][toCol] || board[toRow][toCol][0] !== piece[0];
      }
    } else if (piece[1] === 'k') {
      // King movement logic
      const rowDiff = Math.abs(fromRow - toRow);
      const colDiff = Math.abs(fromCol - toCol);
      return rowDiff <= 1 && colDiff <= 1 && (!board[toRow][toCol] || board[toRow][toCol][0] !== piece[0]);
    }
    return false;
  };

  const handleSquareClick = async (row, col) => {
    if (selectedPiece) {
      const { piece, row: fromRow, col: fromCol } = selectedPiece;
  
      if (fromRow === row && fromCol === col) {
        setSelectedPiece(null);
      } else if (isValidMove(piece, fromRow, fromCol, row, col)) {
        if (piece[0] !== turn) {
          alert("상대방의 차례입니다.");
          setSelectedPiece(null);
          return;
        }
  
        const newBoard = board.map((r) => r.slice());
        newBoard[row][col] = board[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
  
        const move = piece[1] === 'p'
          ? `${String.fromCharCode(97 + col)}${8 - row}` // 폰의 이동
          : `${piece[1].toUpperCase()}${board[row][col] ? 'x' : ''}${String.fromCharCode(97 + col)}${8 - row}`;
  
        const newMoveHistory = [...moveHistory, move];
        setMoveHistory(newMoveHistory);
        console.log('My move:', move); // 클라이언트가 수행한 이동을 출력
  
        // Turn switching logic
        setTurn(turn === 'W' ? 'B' : 'W');
  
        // Send move history to Flask server
        try {
          const response = await fetch('http://localhost:5000/process_moves', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moves: newMoveHistory }),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const result = await response.json();
          console.log('Server response:', result); // 서버의 응답을 출력하여 확인
  
          // Parse and make the opponent's move
          const opponentMove = result.response_move;
          console.log('Opponent move:', opponentMove); // 상대방의 이동을 출력하여 확인
  
          const [toRow, toCol] = parseMove(opponentMove);
  
          if (toRow !== null && toCol !== null) {
            const pieces = [];
            for (let rowIndex = 0; rowIndex < newBoard.length; rowIndex++) {
              for (let colIndex = 0; colIndex < newBoard[rowIndex].length; colIndex++) {
                const piece = newBoard[rowIndex][colIndex];
                if (piece && piece[0] === 'B' && isValidMove(piece, rowIndex, colIndex, toRow, toCol)) {
                  pieces.push({ piece, row: rowIndex, col: colIndex });
                }
              }
            }
  
            if (piece) {
              const [fromRow, fromCol] = piece;
              newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
              newBoard[fromRow][fromCol] = null;
              setBoard(newBoard);
  
              const opponentMoveHistory = [...newMoveHistory, opponentMove];
              setMoveHistory(opponentMoveHistory);
  
              setTurn(turn === 'W' ? 'B' : 'W');
            } else {
              console.error('Invalid move received from server');
            }
          } else {
            console.error('Invalid move format received from server');
          }
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      } else {
        alert("유효하지 않은 이동입니다.");
        setSelectedPiece(null);
      }
    } else if (board[row][col]) {
      if (board[row][col][0] !== turn) {
        alert("상대방의 차례입니다.");
        return;
      }
      setSelectedPiece({ piece: board[row][col], row, col });
    }
  };

  const renderBoard = () => {
    const renderedBoard = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDarkSquare = (row + col) % 2 === 1;
        const pieceType = board[row][col];
        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;

        renderedBoard.push(
          <Square
            key={`${row}-${col}`}
            dark={isDarkSquare}
            selected={isSelected}
            onClick={() => handleSquareClick(row, col)}
          >
            {pieceType && <Piece src={pieceImages[pieceType]} alt={pieceType} />}
          </Square>
        );
      }
    }
    return renderedBoard;
  };

  return (
    <Body>
      <Header></Header>
      <HelpButton onClick={toggleTooltip}>?</HelpButton>
      {showTooltip && (
        <Tooltip>
          현재 상황에서 가장 유리한 수는 e5입니다. e5는 체스판의 중앙을 통제하는 좋은 수입니다. 중앙 통제는 체스 게임에서 중요한 요소 중 하나로, 게임 초반에 중앙을 장악하면 말들을 보다 자유롭게 움직일 수 있습니다. 또한 다양한 오프닝으로 발전할 수 있는 유연한 수입니다. 예를 들어, 루이 로페즈(스페인 오프닝), 이탈리아 게임, 스코치 게임, 피아노 게임 등 여러 유명한 오프닝으로 이어질 수 있습니다.
        </Tooltip>
      )}
      {isGameOver && (
        <Overlay>
          <MessageBox>
            유저 승리!
          </MessageBox>
        </Overlay>
      )}
      <BoardBox>
        <BoardContainer>{renderBoard()}</BoardContainer>
      </BoardBox>
      <ChatWindow></ChatWindow>
    </Body>
  );
}

export default App;