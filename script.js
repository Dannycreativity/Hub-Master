let board = Array(9).fill(null);
let currentPlayer = 'X';
let playerMoves = { X: 0, O: 0 };
let placedPositions = { X: [], O: [] };
let isGameOver = false;
let selectedPosition = null;

const winningCombinations = [
 [0, 1, 2],
 [3, 4, 5],
 [6, 7, 8],
 [0, 3, 6],
 [1, 4, 7],
 [2, 5, 8],
 [0, 4, 8],
 [2, 4, 6]
];

function makeMove(index) {
 if (isGameOver) return;

 if (selectedPosition !== null) {
 if (board[index] === null) {
 board[selectedPosition] = null;
 board[index] = currentPlayer;
 placedPositions[currentPlayer] = placedPositions[currentPlayer].filter(pos => 
pos !== selectedPosition);
 placedPositions[currentPlayer].push(index);
 selectedPosition = null;
 updateBoard();
 if (checkWinner()) {
 document.getElementById('message').innerText = `Player ${currentPlayer} 
wins!`;
 isGameOver = true;
 } else {
 switchPlayer();
 }
 }
 } else if (board[index] === currentPlayer) {
 selectedPosition = index;
 } else if (board[index] === null && playerMoves[currentPlayer] < 3) {
 board[index] = currentPlayer;
 playerMoves[currentPlayer]++;
 placedPositions[currentPlayer].push(index);
 updateBoard();
 if (checkWinner()) {
 document.getElementById('message').innerText = `Player ${currentPlayer} 
wins!`;
 isGameOver = true;
 } else {
 switchPlayer();
 }
 }
}

function switchPlayer() {
 currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
 document.getElementById('turn-info').innerText = `Turn: ${currentPlayer}`;
 document.body.classList.toggle('turn-x', currentPlayer === 'X');
 document.body.classList.toggle('turn-o', currentPlayer === 'O');
}

function updateBoard() {
 for (let i = 0; i < board.length; i++) {
 document.getElementById(`cell-${i}`).innerText = board[i];
 document.getElementById(`cell-${i}`).classList.toggle('selected', i === 
selectedPosition);
 }
}

function checkWinner() {
 return winningCombinations.some(combination => 
 combination.every(index => board[index] === currentPlayer)
 );
}

document.addEventListener('DOMContentLoaded', () => {
 document.body.classList.add('turn-x');
});