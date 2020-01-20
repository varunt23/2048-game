export default class Game {
  constructor(size) {
    this.size = size;
    this.setupNewGame(this.size)
  }

  //new game on load or when the button is clicked
  setupNewGame(size) {
    this.gameState = {
      board: this.newGame(),
      score: 0,
      won: false,
      over: false,
    }
  }

  //makes a new games and resets all the properties
  newGame() {
    this.movecallbacks = []
    this.wincallbacks = []
    this.losecallbacks = []
    this.grid = this.fresh()
    this.addNumbertotheBoard()
    this.addNumbertotheBoard()
    return this.convert()

  }

  //makes a fresh new grid with all zeroes for all the columns
  fresh() {
    let holdnew = []
    let len = this.size
    for (let i = 0; i < len; i++) {
      holdnew.push(this.rowwithzeroes())
    }
    return holdnew
  }

  //makes a row with all zeroes
  rowwithzeroes() {
    let len = this.size
    var row = []
    for (let j = 0; j < len; j++) {
      row.push(0)
    }
    return row
  }

  //converting into a 1D array (called board in the gameState properties)
  convert() {
    let board = []
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        board.push(this.grid[i][j])
      }
    }
    return board
  }

  //convert the board from 2D to a 1D array
  revconvert() {
    let int = 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = this.gameState.board[int]
        int = int + 1
      }
    }
  }

  //add a new game in the system - and then convert into a 2D array usable by the program
  loadGame(gameState) {
    this.gameState = gameState
    this.revconvert()
  }

  //move method key move movements
  move(direction) {
    this.gameState.board = this.convert()
    let flipped = false
    let rotated = false
    let played = true

    switch(direction) {
      case 'right':
        this.handle(false, false)
        break;
      case 'left':
        this.grid = this.reflect(this.grid)
        this.handle(true, false)
        break;
      case 'up':
        this.grid = this.rotate(this.grid)
        this.grid = this.reflect(this.grid)
        this.handle(true,true)
        break;
      case 'down':
        this.grid = this.rotate(this.grid)
        this.handle(false, true)
        break;
    }
    this.gameState.board = this.convert()
  }

  //helper method to allow for board events such as gamewon and gamelost to be handled
  handle(flipped, rotated) {
    this.gameState.board = this.convert()      
      let extra = this.fresh();
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          extra[i][j] = this.grid[i][j];
        }
      }
      //performing neccesary workings on the matrix
      for (let i = 0; i < this.size; i++) {
        let row = this.grid[i]
        let arr = row.filter(val => val);
        let missing = this.size - arr.length;
        let zeros = Array(missing).fill(0);
        arr = zeros.concat(arr);
        this.grid[i] = arr
        this.grid[i] = this.combine(this.grid[i]);
        row = this.grid[i]
        arr = row.filter(val => val);
        missing = this.size - arr.length;
        zeros = Array(missing).fill(0);
        arr = zeros.concat(arr);
        this.grid[i] = arr
      }

      //checking if the matrix was changed
      let changed = false
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (extra[i][j] !== this.grid[i][j]) {
            changed = true;
          }
        }
      }
      
      //if flipped then execute
      if (flipped) {
        for (let i = 0; i < this.size; i++) {
          this.grid[i].reverse();
        }
      }
      
      //further execute the rotate method
      if (rotated) {
        this.grid = this.rotate(this.grid);
      }
      //if the board was changed then add a number to the board
      if (changed) {
        this.addNumbertotheBoard();
      }
      this.endingSituations()
      
  }

  //this method handles all the winning and losing situations
  endingSituations() {
    this.moveCallbacks()

    if (this.finished()) {
      this.gameState.over = true
      for (let i = 0; i < this.losecallbacks.length; i++) {
        this.losecallbacks[i](this.gameState)
      }
    }
    if (this.won()) {
      this.gameState.won = true
      for (let i = 0; i < this.wincallbacks.length; i++) {
        this.wincallbacks[i](this.gameState)
      }
    }
  }

  //handles all the callbacks
  moveCallbacks() {
    for (let i = 0; i < this.movecallbacks.length; i++) {
      this.movecallbacks[i](this.gameState)
    }
  }


  //flips the grid over either the x or y axis - as per the movement
  reflect(grid) {
    for (let i = 0; i < this.size; i++) {
      grid[i].reverse();
    }
    return grid;
  }

  //handles all rotating movements
  rotate(grid) {
    let newGrid = this.fresh();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newGrid[i][j] = grid[j][i];
      }
    }
    return newGrid;
  }

  //combining of the numbers when they are the same
  combine(row) {
    for (let i = this.size - 1; i >= 1; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a == b) {
        row[i] = a + b;
        this.gameState.score += row[i];
        row[i - 1] = 0;
      }
    }
    return row;
  }

  //checks whether one won
  won() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] == 2048) {
          return true;
        }
      }
    }
    return false;
  }

  //getter for the size of the grid
  getSize() {
    return this.size
  }

  //checks if the game is lost
  finished() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] == 0) {
          return false;
        }
        if (i !== this.size - 1 && this.grid[i][j] === this.grid[i + 1][j]) {
          return false;
        }
        if (j !== this.size - 1 && this.grid[i][j] === this.grid[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  }

  //prints out a string representation of the board
  toString() {
    return this.gameState.board.toString()
  }

  //methods below handle all the callbacks
  onMove(callback) {
    this.movecallbacks.push(callback)
  }

  onWin(callback) {
    this.wincallbacks.push(callback)
  }

  onLose(callback) {
    this.losecallbacks.push(callback)
  }

  //retrieve the gameState after converting to 1D array
  getGameState() {
    this.gameState.board = this.convert()
    return this.gameState
  }

  //handles adding to the board after a move
  addNumbertotheBoard() {
    let openboxes = this.findOptions()
    this.probabilityCalculator(openboxes)
  }

  //finds boxes with zero
  findOptions() {
    let openboxes = []
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          openboxes.push({
            x: i,
            y: j
          });
        }
      }
    }
    return openboxes
  }

  //assigns to the board after calculating the probability
  probabilityCalculator(openboxes) {
    if (openboxes.length > 0) {
      let spot = openboxes[Math.floor(Math.random() * openboxes.length)]
      let r = Math.random()
      this.grid[spot.x][spot.y] = r > .9 ? 4 : 2
    }
  }
}




















