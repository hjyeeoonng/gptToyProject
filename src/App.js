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

function App() {
  const [board, setBoard] = useState(initialSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

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

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      const { piece, row: fromRow, col: fromCol } = selectedPiece;

      if (fromRow === row && fromCol === col) {
        setSelectedPiece(null);
      } else if (isValidMove(piece, fromRow, fromCol, row, col)) {
        const newBoard = board.map((r) => r.slice());
        newBoard[row][col] = board[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        setBoard(newBoard);
        setSelectedPiece(null);

        const move = piece[1] === 'p'
          ? `${String.fromCharCode(97 + col)}${8 - row}` // 폰의 이동
          : `${piece[1].toUpperCase()}${board[row][col] ? 'x' : ''}${String.fromCharCode(97 + col)}${8 - row}`;

        setMoveHistory([...moveHistory, move]);
        console.log(move); // 콘솔에 출력
      } else {
        alert("유효하지 않은 이동입니다.");
        setSelectedPiece(null);
      }
    } else if (board[row][col]) {
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
      <BoardBox>
        <BoardContainer>{renderBoard()}</BoardContainer>
      </BoardBox>
      <ChatWindow></ChatWindow>
    </Body>
  );
}

export default App;