const gameBoard = (function () {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const gameBoardElement = document.getElementById("game-board");

    const setClickListener = (event) => {
        let targetElem;
        if (event.target.tagName === "P") {
            targetElem = event.target.parentElement;
        } else {
            targetElem = event.target;
        }

        if (!targetElem.classList.contains("empty")) {
            return;
        }

        const index = parseInt(targetElem.id.split("-")[1]);
        const x = parseInt((index - 1) / 3);
        const y = (index - 1) % 3;

        gameStatus.placeSign(x, y);
    };

    const makeCell = (num, sign) => {
        const htmlString = `
            <div class="board-cell ${
                sign === "" ? "empty" : ""
            }" id="cell-${num}">
                <p>${sign}</p>
            </div>
        `;

        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlString;
        const cell = tempElement.firstElementChild;

        cell.addEventListener("click", (e) => {
            setClickListener(e);
        });

        return cell;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = "";
            }
        }
        renderBoard();
    };

    const renderBoard = () => {
        gameBoardElement.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = makeCell(i * 3 + j + 1, board[i][j].trim());

                gameBoardElement.appendChild(cell);
            }
        }
    };

    const placeSign = (x, y, sign) => {
        if (x > 2 || y > 2 || x < 0 || y < 0) {
            console.error("Invalid coordinates");
            return;
        }

        if (board[x][y]) {
            return;
        }

        board[x][y] = sign;

        renderBoard();
    };

    const checkWin = (sign) => {
        // Check rows
        for (let i = 0; i < board.length; i++) {
            if (
                board[i][0] === sign &&
                board[i][1] === sign &&
                board[i][2] === sign
            ) {
                return 1;
            }
        }

        // Check columns
        for (let j = 0; j < board[0].length; j++) {
            if (
                board[0][j] === sign &&
                board[1][j] === sign &&
                board[2][j] === sign
            ) {
                return 1;
            }
        }

        // Check diagonals
        if (
            board[0][0] === sign &&
            board[1][1] === sign &&
            board[2][2] === sign
        ) {
            return 1;
        }
        if (
            board[0][2] === sign &&
            board[1][1] === sign &&
            board[2][0] === sign
        ) {
            return 1;
        }

        // There are still empty cells
        // No win condition met
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "") {
                    return 0;
                }
            }
        }

        // Board is full
        return -1;
    };

    return {
        placeSign,
        renderBoard,
        resetBoard,
        checkWin,
    };
})();

const Player = function (name, sign, number) {
    const placeSign = (x, y) => {
        gameBoard.placeSign(x, y, sign);
    };

    let score = 0;

    const incrementScore = () => {
        score++;
    };

    const className = ".player-" + name.split(" ")[1];

    return {
        get name() {
            return name;
        },
        set name(newName) {
            name = newName;
        },

        get sign() {
            return sign;
        },
        set sign(newSign) {
            sign = newSign;
        },

        get score() {
            return score;
        },

        get className() {
            return className;
        },

        placeSign,
        incrementScore,
    };
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const gameStatus = (function () {
    let currentPlayer = player1;

    const setCurrentPlayer = (player) => {
        currentPlayer = player;

        const currentPlayerElement = document.querySelector(
            ".current-player > p"
        );

        currentPlayerElement.textContent = currentPlayer.name;
    };

    const switchPlayer = () => {
        if (currentPlayer === player1) {
            setCurrentPlayer(player2);
        } else {
            setCurrentPlayer(player1);
        }
    };

    const placeSign = (x, y) => {
        currentPlayer.placeSign(x, y);
        checkWinAndIncrement();
        switchPlayer();
    };

    const resetGame = () => {
        gameBoard.resetBoard();
        setCurrentPlayer(player1);
    };

    const checkWinAndIncrement = () => {
        const winCondition = gameBoard.checkWin(currentPlayer.sign);
        if (winCondition === 1) {
            currentPlayer.incrementScore();
            const winningPlayer = currentPlayer;
            setTimeout(() => {
                alert(`${winningPlayer.name} wins!`);
                gameBoard.resetBoard();
                renderScores();
            }, 500);
        } else if (winCondition === -1) {
            setTimeout(() => {
                alert("Draw!");
                gameBoard.resetBoard();
            }, 500);
        }
    };

    const renderScores = () => {
        const player1Score = document.querySelector(".scores > .player-1 > p");
        const player2Score = document.querySelector(".scores > .player-2 > p");
        player1Score.textContent = player1.score;
        player2Score.textContent = player2.score;
    };

    const renderGame = () => {
        gameBoard.renderBoard();
        renderScores();
    };

    const updatePlayerName = (player, newName) => {
        player.name = newName;
        if (currentPlayer === player) {
            setCurrentPlayer(player);
        }
        document.querySelector(
            `.scores > ${player.className} > h5`
        ).textContent = player.name;
    };

    return {
        placeSign,
        resetGame,
        renderGame,
        updatePlayerName,
    };
})();

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
    // for now it will just reset the board, eventually it will reset the scores as well
    gameStatus.resetGame();
});

// for each of .player-1 and .player-2 when the div.score is clicked, then it should prompt to enter a new name for that player
for (let i = 0; i < document.querySelectorAll(".score").length; i++) {
    document.querySelectorAll(".score")[i].addEventListener("click", () => {
        let playerName = prompt("Enter a name for player " + (i + 1));
        if (playerName === null) {
            return;
        }
        const playerNumber = document
            .querySelectorAll(".score")
            [i].classList[0].split("-")[1];

        if (playerNumber === "1") {
            gameStatus.updatePlayerName(player1, playerName);
        } else {
            gameStatus.updatePlayerName(player2, playerName);
        }
    });
}

gameStatus.renderGame();
