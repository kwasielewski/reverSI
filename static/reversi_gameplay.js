initBoard = [[0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, -1, 1, 0, 0, 0],
                 [0, 0, 0, 1, -1, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0]]  // this initialization has to be connected to some POST method (and used only once)

const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];

function checkCell(board, cellRow, cellCol, player) {
    // first recognize what the player clicked
    // see if this cell can be selected according to game rules

    // if (cellRow < 0 || cellRow >= 8 || cellCol < 0 && cellCol >= 8) {
    //     return false; // cell is outside of range
    // }

    // if (board[cellRow][cellCol] != 0) {
    //     return false; // cell is already taken
    // }

    // for (let i = 0; i < 8; i++) {
    //     let currentRow = cellRow, currentCol = cellCol;
    //     const dir = dirs[i];
    //     while (currentRow >= 0 && currentRow < 8 || currentCol >= 0 && currentCol < 8) {
            
    //         currentRow += dir[0];
    //         currentCol += dir[1];
    //     }
    // }

    return true;
}

function selectCell(board, cellRow, cellCol, player) {
    // if the cell is can be selected we:
    //  - draw an appropriate circle
    //  - flip the other discs
    //  - pass the resulting object back to the socket.emit method

    console.log(`Selected cell: ${cellRow}, ${cellCol}`);

    gameState.board[cellRow][cellCol] = player;
}

function drawBoard(board, player) {
    // ideally we would like to move the script for drawing the board here so that both attack & defence can use it

    const squareSize = 60;

    let canvas = document.getElementById('canvasBoard');
    context = canvas.getContext('2d');

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
            if (board[row][col] != 0) {
                context.beginPath();
                context.arc(col*squareSize + squareSize/2, row*squareSize + squareSize/2, 25, 0, 2*Math.PI, false);
                context.fillStyle = (board[row][col] == -1) ? 'white' : 'black';
                context.fill();
            }
        }
    }

    context.strokeStyle = 'black';
    context.strokeRect(0, 0, squareSize*8, squareSize*8)

    canvas.onclick = function(event) { // TODO: figure out why this works, but addEventListener doesn't?
        // make sure the user clicked somewhere "in range"?
        let cellRow = Math.floor(event.pageY / squareSize) - 1;
        let cellCol = Math.floor(event.pageX / squareSize) - 1;
        console.log('Hello, you clicked!')

        if (checkCell(board, cellRow, cellCol, player)) {
            selectCell(board, cellRow, cellCol, player);
        }
    };

    return board;
}

window.onload = function() {
    drawBoard(gameState.board, gameState.player);
}