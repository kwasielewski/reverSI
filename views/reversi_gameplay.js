function drawBoard(board) {
    // ideally we would like to move the scipt for drawing the board here so that both attack & defence can use it
  }

function checkCell(board, cellID) {
    // see if this cell can be selected according to game rule
}

function selectCell(board, cellID) {
    // if the cell is can be selected we:
    //  - draw an appropriate circle
    //  - flip the other discs
    //  - pass the resulting object back to the socket.emit method
}