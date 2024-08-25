function setDifficulty(level) {
    difficultyLevel = level;
} let board = Array(9).fill(null);
let currentPlayer = 'X';
let playerMoves = { X: 0, O: 0 };
let placedPositions = { X: [], O: [] };
let isGameOver = false;
let selectedPosition = null;
let aiPlayer = 'O'; // Assuming the AI plays as 'O'
let difficultyLevel = 'medium'; // Change this to 'easy', 'medium', or 'hard'

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
    if (isGameOver || (currentPlayer === aiPlayer && difficultyLevel !== 'none'))
        return;

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
                if (currentPlayer === aiPlayer) aiMove();
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
            if (currentPlayer === aiPlayer) aiMove();
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

function aiMove() {
    let index;
    if (difficultyLevel === 'easy') {
        index = easyAiMove();
    } else if (difficultyLevel === 'medium') {
        index = mediumAiMove();
    } else if (difficultyLevel === 'hard') {
        index = minimax(board, aiPlayer).index;
    }
    makeMove(index);
}

function easyAiMove() {
    let emptyCells = board.map((cell, index) => cell === null ? index :
        null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function mediumAiMove() {
    // Try to win or block the opponent
    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (board[a] === aiPlayer && board[b] === aiPlayer && board[c] === null)
            return c;
        if (board[a] === aiPlayer && board[c] === aiPlayer && board[b] === null)
            return b;
        if (board[b] === aiPlayer && board[c] === aiPlayer && board[a] === null)
            return a;

        if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] ===
            null) return c;
        if (board[a] === currentPlayer && board[c] === currentPlayer && board[b] ===
            null) return b;
        if (board[b] === currentPlayer && board[c] === currentPlayer && board[a] ===
            null) return a;
    }
    return easyAiMove();
}

function minimax(newBoard, player) {
    let availSpots = newBoard.map((cell, index) => cell === null ? index :
        null).filter(index => index !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function checkWin(board, player) {
    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('turn-x');
    if (currentPlayer === aiPlayer) aiMove();
});