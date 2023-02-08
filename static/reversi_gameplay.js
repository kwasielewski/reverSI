initBoard = [[0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, -1, 1, 0, 0, 0],
             [0, 0, 0, 1, -1, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0]];

const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];

const squareSize = 60;

function isInRange(cellRow, cellCol) {
    return cellRow >= 0 && cellRow < 8 && cellCol >= 0 && cellCol < 8;
}

function checkCell(cellRow, cellCol) {
    // first recognize what the player clicked
    // see if this cell can be selected according to game rules

    if (!isInRange(cellRow, cellCol) || gameState.board[cellRow][cellCol] != 0) {
        return false; // cell is outside of range or non-empty
    }

    for (let i = 0; i < 8; i++) {
        const dir = dirs[i];
        let currentRow = cellRow + dir[0], currentCol = cellCol + dir[1];
        let oppositeTiles = 0;

        while (isInRange(currentRow, currentCol) && gameState.board[currentRow][currentCol] == -gameState.player) {
            oppositeTiles += 1;
            currentRow += dir[0];
            currentCol += dir[1];
        }

        if (isInRange(currentRow, currentCol) && gameState.board[currentRow][currentCol] == gameState.player && oppositeTiles) {
            return true;
        }
    }

    return false;
}

function selectCell(cellRow, cellCol) {
    // if the cell is can be selected we:
    //  - draw an appropriate circle
    //  - flip the other discs
    //  - pass the resulting object back to the socket.emit method

    console.log(`Selected cell: ${cellRow}, ${cellCol}`);

    gameState.board[cellRow][cellCol] = gameState.player;

    let tilesToFlip = [];

    for (let i = 0; i < 8; i++) {
        const dir = dirs[i];
        let currentRow = cellRow + dir[0], currentCol = cellCol + dir[1];
        let oppositeTiles = [];

        while (isInRange(currentRow, currentCol) && gameState.board[currentRow][currentCol] == -gameState.player) {
            oppositeTiles.push([currentRow, currentCol]);
            currentRow += dir[0];
            currentCol += dir[1];
        }

        if (isInRange(currentRow, currentCol) && gameState.board[currentRow][currentCol] == gameState.player && oppositeTiles) {
            tilesToFlip.push(...oppositeTiles);
        }
    }

    for (let i = 0; i < tilesToFlip.length; i++) {
        const tileCoords = tilesToFlip[i];
        gameState.board[tileCoords[0]][tileCoords[1]] = gameState.player;
    }
}

function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            context.fillStyle = ((row + col) % 2 == 0) ? 'grey' : 'lightgrey';
            let xOffset = col*squareSize;
            let yOffset = row*squareSize;
            context.fillRect(xOffset, yOffset, squareSize, squareSize);
        }
    }

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (gameState.board[row][col] != 0) {
                context.beginPath();
                context.arc(col*squareSize + squareSize/2, row*squareSize + squareSize/2, 25, 0, 2*Math.PI);
                context.fillStyle = (gameState.board[row][col] == -1) ? 'white' : 'black';
                context.fill();
            }
        }
    }

    context.strokeStyle = 'black';
    context.strokeRect(0, 0, squareSize*8, squareSize*8)
}

function handleTurn() {
    // first check for end of game!
    // if the game's finished display the score and an appropriate message

    let canvas = document.getElementById('canvasBoard');
    context = canvas.getContext('2d');
    madeMove = false;

    drawBoard();
    
    canvas.addEventListener('click', function(event) {
        // make sure the user clicked somewhere "in range"?
        const offset = canvas.getBoundingClientRect();

        let cellRow = Math.floor((event.pageY - offset.y) / squareSize);
        let cellCol = Math.floor((event.pageX - offset.x) / squareSize);
        console.log('Hello, you clicked!')

        if (checkCell(cellRow, cellCol) && !madeMove) {
            madeMove = true;
            selectCell(cellRow, cellCol);
        }

        drawBoard();
    });
}

window.onload = handleTurn;