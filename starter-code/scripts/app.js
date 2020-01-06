function init() {

  //  DOM VARIABLES
  const levelDisplay = document.querySelector('h2#level')
  const currentScoreDisplay = document.querySelector('h2#current-score')
  const highScoreDisplay = document.querySelector('h2#high-score')
  const grid = document.querySelector('.grid') // grab grid div from HTML
  const countdownDisplay = document.querySelector('h2.countdown')
  const livesDisplay = document.querySelector('h2#lives-left')

  // GAME VARIABLES
  const squares = [] // squares within grid
  const width = 28 // number of squares across
  const height = 31 // number of squares down
  const directionArray = [1, -1, 28, -28, 27, -27] // down, up, right, left, left hole to right hole, right hole to left hole
  const directionObject = {
    '-1': 'right',
    '1': 'left',
    '28': 'top',
    '-28': 'bottom'
  }
  const pacManMouthArray = ['half', 'open', 'half', 'closed']

  let level = 1
  let score = 0
  let highScore = 0
  let lives = 2 // initial lives -> die if lives < 0
  
  let timerId1 = null
  let timerId2 = null
  let timerId3 = null
  let timerId4 = null
  let timerId5 = null
  let timerId6 = null
  let timerId7 = null
  let timerId8 = null
  let timerId9 = null
  let timerId10 = null
  let timerId11 = null
  let timerId12 = null
  let timerId13 = null
  let countDownTime = 3 // countdown starts from 3 before game starts
  // let scatterTime = 0

  const playerSpeed = 150
  let ghostSpeed = 200

  // wallsArray constants
  const F = 'F' // food
  const X = 'X' // food at junction
  const E = 'E' // energizer
  const Y = 'Y' // energizer at junction
  const N = 'N' // nothing
  const Z = 'Z' // nothing at junction
  const L = 'L' // ghost goes left
  const U = 'U' // ghost goes up
  const R = 'R' // ghost goes right
  const D = 'D' // door to pen
  const openSquares = [F, X, E, Y, N, Z]

  // SET INITIAL DOM VARIABLES
  levelDisplay.innerHTML = level
  currentScoreDisplay.innerHTML = '00'
  highScoreDisplay.innerHTML = '00'
  countdownDisplay.innerHTML = 'hit space'
  livesDisplay.innerHTML = `${lives} lives left`
  
  // loop as many times as width times the height to fill the grid
  Array(width * height).join('.').split('.').forEach(() => { // create array with (width * height) empty elements ''
    const square = document.createElement('div') // create a square for each element
    square.classList.add('grid-item') // add grid-item class to each square
    squares.push(square) // push square to squares array
    grid.appendChild(square) // append square to the grid div
  })

  // create wall array: 0 = horizontal, 1 = vertical, 2 = TL outer, 3 = TR outer, 4 = BR outer, 5 = BL outer, 6 = TL inner, 7 = TR inner, 8 = BR inner, 9 = BL inner

  const wallsArray = [
    2,0,0,0,0,0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,3,
    1,X,F,F,F,F,X,F,F,F,F,F,X,1,1,X,F,F,F,F,F,X,F,F,F,F,X,1,
    1,F,6,0,0,7,F,6,0,0,0,7,F,1,1,F,6,0,0,0,7,F,6,0,0,7,F,1,
    1,E,1,N,N,1,F,1,N,N,N,1,F,1,1,F,1,N,N,N,1,F,1,N,N,1,E,1,
    1,F,9,0,0,8,F,9,0,0,0,8,F,9,8,F,9,0,0,0,8,F,9,0,0,8,F,1,
    1,X,F,F,F,F,X,F,F,X,F,F,X,F,F,X,F,F,X,F,F,X,F,F,F,F,X,1,
    1,F,6,0,0,7,F,6,7,F,6,0,0,0,0,0,0,7,F,6,7,F,6,0,0,7,F,1,
    1,F,9,0,0,8,F,1,1,F,9,0,0,3,2,0,0,8,F,1,1,F,9,0,0,8,F,1,
    1,X,F,F,F,F,X,1,1,X,F,F,X,1,1,X,F,F,X,1,1,X,F,F,F,F,X,1,
    5,0,0,0,0,7,F,1,5,0,0,7,N,1,1,N,6,0,0,4,1,F,6,0,0,0,0,4,
    N,N,N,N,N,1,F,1,2,0,0,8,N,9,8,N,9,0,0,3,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,Z,N,N,Z,N,N,Z,N,N,Z,1,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,N,6,0,0,D,D,0,0,7,N,1,1,F,1,N,N,N,N,N,
    0,0,0,0,0,8,F,9,8,N,1,R,R,U,U,L,L,1,N,9,8,F,9,0,0,0,0,0,
    N,N,N,N,N,N,X,N,N,Z,1,R,R,U,U,L,L,1,Z,N,N,X,N,N,N,N,N,N,
    0,0,0,0,0,7,F,6,7,N,1,R,R,U,U,L,L,1,N,6,7,F,6,0,0,0,0,0,
    N,N,N,N,N,1,F,1,1,N,9,0,0,0,0,0,0,8,N,1,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,Z,N,N,N,N,N,N,N,N,Z,1,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,N,6,0,0,0,0,0,0,7,N,1,1,F,1,N,N,N,N,N,
    2,0,0,0,0,8,F,9,8,N,9,0,0,3,2,0,0,8,N,9,8,F,9,0,0,0,0,3,
    1,X,F,F,F,F,X,F,F,X,F,F,X,1,1,X,F,F,F,F,F,X,F,F,F,F,X,1,
    1,F,6,0,0,7,F,6,0,0,0,7,F,1,1,F,6,0,0,0,7,F,6,0,0,7,F,1,
    1,F,9,0,3,1,F,9,0,0,0,8,F,9,8,F,9,0,0,0,8,F,1,2,0,8,F,1,
    1,Y,F,X,1,1,X,F,F,X,F,F,X,F,F,X,F,F,X,F,F,X,1,1,X,F,Y,1,
    5,0,7,F,1,1,F,6,7,F,6,0,0,0,0,0,0,7,F,6,7,F,1,1,F,6,0,4,
    2,0,8,F,9,8,F,1,1,F,9,0,0,3,2,0,0,8,F,1,1,F,9,8,F,9,0,3,
    1,X,F,X,F,F,X,1,1,X,F,F,X,1,1,X,F,F,X,1,1,X,F,F,X,F,X,1,
    1,F,6,0,0,0,0,4,5,0,0,7,F,1,1,F,6,0,0,4,5,0,0,0,0,7,F,1,
    1,F,9,0,0,0,0,0,0,0,0,8,F,9,8,F,9,0,0,0,0,0,0,0,0,8,F,1,
    1,X,F,F,F,F,F,F,F,F,F,F,X,F,F,X,F,F,F,F,F,F,F,F,F,F,X,1,
    5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4]

  // loop through walls array to build walls and food
  for (let i = 0; i < width * height; i++) {
    switch (wallsArray[i]) {
      case 0:
        squares[i].classList.add('wall')
        squares[i].classList.add('top')
        break
      case 1:
        squares[i].classList.add('wall')
        squares[i].classList.add('left')
        break
      case 2: 
        squares[i].classList.add('wall')
        squares[i].classList.add('top')
        squares[i].classList.add('left')
        break
      case 3:
        squares[i].classList.add('wall')
        squares[i].classList.add('top')
        squares[i].classList.add('right')
        break
      case 4:
        squares[i].classList.add('wall')
        squares[i].classList.add('bottom')
        squares[i].classList.add('right')
        break
      case 5:
        squares[i].classList.add('wall')
        squares[i].classList.add('bottom')
        squares[i].classList.add('left')
        break
      case 6:
        squares[i].classList.add('wall')
        squares[i].classList.add('top')
        squares[i].classList.add('left')
        squares[i].classList.add('inner')
        break
      case 7:
        squares[i].classList.add('wall')
        squares[i].classList.add('top')
        squares[i].classList.add('right')
        squares[i].classList.add('inner')
        break
      case 8:
        squares[i].classList.add('wall')
        squares[i].classList.add('bottom')
        squares[i].classList.add('right')
        squares[i].classList.add('inner')
        break
      case 9:
        squares[i].classList.add('wall')
        squares[i].classList.add('bottom')
        squares[i].classList.add('left')
        squares[i].classList.add('inner')
        break
      case F:
        squares[i].classList.add('food')
        break
      case X:
        squares[i].classList.add('food')
        break
      case E:
        squares[i].classList.add('energizer')
        break
      case Y:
        squares[i].classList.add('energizer')
        break
      case D:
        squares[i].classList.add('door')
        break
    }
  }

  // create Ghost class with properties and movement method
  class Characters {
    constructor(name, startingIndex, startingDirection, previousIndex, currentIndex, currentDirection, penPosition) {
      this.name = name, // colour of ghost
      this.startingIndex = startingIndex
      this.startingDirection = startingDirection
      this.previousIndex = previousIndex // previous position
      this.currentIndex = currentIndex // current position
      this.currentDirection = currentDirection, // current direction
      this.penPosition = penPosition
      this.currentRow = Math.ceil((this.currentIndex + 1) / width)
      this.currentColumn = ((this.currentIndex + 1) % width) === 0 ? width : ((this.currentIndex + 1) % width)
      this.distanceBetween = Math.sqrt((this.rowDifference ** 2) + (this.columnDifference ** 2))
      this.directionArray = [1, -1, 28, -28, 27, -27], // array of possible directions, to be filtered down
      this.openSquares = [F, X, E, Y, N, Z]
      this.whereToGo = [] // empty array to be filled with available directions
      this.chaseStatus = 'Y'
      this.inPenOrNot = 'N'
      this.captureTime = 0
      this.scatterStatus = 'N'
      this.scatterTime = 0

    }
    specialTiles () {
      if (this.inPenOrNot === 'N') {
        if (wallsArray[this.currentIndex] === 'R') { // if ghost is on left hand side of pen, it should go right
          this.currentDirection = 1
        } else if (wallsArray[this.currentIndex] === 'L') { // if ghost is on right hand side of pen, it should go left
          this.currentDirection = -1
        } else if (wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D') { // if ghost is down the middle of the pen, it should go up
          this.currentDirection = -28
        }
      } else {
        this.currentDirection = 0
      }
      if (this.currentIndex === 392) { // if ghost is crossing hole in the wall, make sure it continues correctly
        switch (this.currentDirection) {
          case -1:
            this.currentDirection = 27
            break
          case -27:
            this.currentDirection = 1
            break
        }
      } else if (this.currentIndex === 419) { // if ghost is crossing hole in the wall, make sure it continues correctly
        switch (this.currentDirection) {
          case 1:
            this.currentDirection = -27
            break
          case 27:
            this.currentDirection = -1
            break
        }
      }
    }
    standardTiles () {
      // Rules for normal tiles, nextAlong is the next position the ghost would be in if it follows same direction

      const nextAlong = this.currentIndex + this.currentDirection

      this.directionArray = [1, -1, 28, -28].concat(this.whereToGo)

      this.whereToGo = []

      // If there is no wall in same direction the ghost is already going, then remove opposite direction from options

      this.openSquares = [F, X, E, Y, N, Z]

      if (openSquares.includes(wallsArray[nextAlong])) {
        this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== ((-1) * (this.currentDirection)))
      }

      for (const eachDirection of this.directionArray) { // loop through all options left of where ghost can go
        const potentialPos = this.currentIndex + eachDirection
        if (openSquares.includes(wallsArray[potentialPos])) {
          this.whereToGo.push(eachDirection) // push all directions left where there won't be a wall to whereToGo
        }
      }
    }
    redSmartMove () {
      const smartDirectionsArray = []
      for (const eachDirection of this.whereToGo) {
        const potentialSmartPos = this.currentIndex + eachDirection
        const potentialSmartRow = Math.ceil((potentialSmartPos + 1) / width)
        const potentialSmartColumn = ((potentialSmartPos + 1) % width) === 0 ? width : ((potentialSmartPos + 1) % width)
        const smartRowDifference = potentialSmartRow - pacMan.currentRow
        const smartColumnDifference = potentialSmartColumn - pacMan.currentColumn
        const potentialDistance = Math.sqrt((smartRowDifference ** 2) + (smartColumnDifference ** 2))
        smartDirectionsArray.push(potentialDistance)
      }
      let lowest = 0
      for (let i = 0; i < smartDirectionsArray.length; i++) {
        if (smartDirectionsArray[i] < smartDirectionsArray[lowest]) {
          lowest = i
        }
      }
      const shortestDirection = this.whereToGo[lowest]
      this.whereToGo = []
      this.whereToGo.push(shortestDirection)
    }
    chooseDirection () {
      const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
      this.currentDirection = this.whereToGo[randomNumber] // choose direction from array based off random number
    }
    updateGrid () {
      // update next ghost position by adding direction to current position
      this.currentIndex = this.currentIndex + this.currentDirection

      // store previous position, useful for checkDeath and checkGhostCapture
      this.previousIndex = this.currentIndex - this.currentDirection
      
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.currentIndex].classList.add(this.name)
    }
    storeCoordinates () {
      this.currentRow = Math.ceil((this.currentIndex + 1) / width)
      this.currentColumn = ((this.currentIndex + 1) % width) === 0 ? width : ((this.currentIndex + 1) % width)
    }
    chase () {
      if (this.chaseStatus === 'Y') {
        this.whereToGo = []
        if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
          this.specialTiles()
        } else {
          this.standardTiles()
          if (this.name === 'red') {
            this.redSmartMove()
          }
          this.chooseDirection()
        }
        this.updateGrid()
        this.storeCoordinates()
      }
    }
    capturePacman () {
      // if ((this.chaseStatus = 'Y') && (this.currentIndex === pacMan.currentIndex || (this.currentIndex === pacMan.previousIndex && this.previousIndex === pacMan.currentIndex))) {
      //   capturePacmanAll()
      //   squares.forEach(square => square.classList.remove(this.name))
      //   this.currentIndex = this.startingIndex
      //   this.currentDirection = this.startingDirection
      //   this.captureTime = 0
      //   this.scatterTime = 0
      //   this.scatterStatus = 'N'
      //   this.inPenOrNot = 'N'
      //   this.chaseStatus = 'Y'
      //   squares[this.currentIndex].classList.add(this.name)
      // }
    }
    scatter() {
      if (this.scatterStatus === 'Y') {
        this.chaseStatus = 'N'
        this.whereToGo = []
        if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
          this.specialTiles()
        } else {
          this.standardTiles()
          this.chooseDirection()
        }
        this.updateGrid()
        this.storeCoordinates()

        squares[this.previousIndex].classList.remove('scatter')
        squares[this.currentIndex].classList.add('scatter')

        this.scatterTime++
        console.log('scatter')
        if (this.scatterTime > 12) {

          this.scatterStatus = 'N'
          this.chaseStatus = 'Y'

          switch (this.name) {
            case 'red':
              redChaseTimer()
              break
            case 'blue':
              blueChaseTimer()
              break
            case 'orange':
              orangeChaseTimer()
              break
            case 'pink':
              pinkChaseTimer()
              break
          }
          checkDeathTimer()
          squares.forEach(square => square.classList.remove('scatter'))
          this.scatterTime = 0
        }
      }
    } 
    checkGhostCapture() {
      if (this.scatterStatus === 'Y') {
        if (pacMan.currentIndex === this.currentIndex || ((pacMan.currentIndex === this.previousIndex) && (pacMan.previousIndex === this.currentIndex))) {
          this.inPenOrNot = 'Y'

          squares[this.previousIndex].classList.remove('scatter')
          squares[this.currentIndex].classList.remove('scatter')

        }
      }
    }
    checkInPenOrNot () {
      if (this.inPenOrNot === 'Y') {
        this.currentIndex = this.penPosition
        squares.forEach(square => square.classList.remove(this.name))
        squares[this.currentIndex].classList.add(this.name)
        squares[this.currentIndex].classList.add('scatter')
        // squares[this.previousIndex].classList.remove('scatter')
        this.captureTime++
        if (this.captureTime > 1000) { 
          this.inPenOrNot = 'N'
          this.captureTime = 0
          this.chaseStatus = 'Y'
        }
      }
    }
  }

  class Player extends Characters {
    constructor(name, startingIndex, startingDirection, previousIndex, currentIndex, currentDirection, proposedDirection, pacManMouthArrayIndex) {
      super(name, startingIndex, startingDirection, previousIndex, currentIndex, currentDirection)
      this.proposedDirection = proposedDirection
      this.pacManMouthArrayIndex = pacManMouthArrayIndex
      this.currentIndex = this.startingIndex
      this.currentDirection = this.startingDirection
      this.captureTime = 0
      this.scatterTime = 0
      this.scatterStatus = 'N'
      this.inPenOrNot = 'N'
      this.chaseStatus = 'Y'
    }
    automaticMovement () {
      switch (this.currentIndex) {
        case 392:
          switch (this.currentDirection) {
            case -1:
              if (this.proposedDirection !== 1) {
                this.currentDirection = 27
              }
              break
            case -27:
              if (this.proposedDirection !== -1) {
                this.currentDirection = 1
              } else {
                this.currentDirection = 27
              }
              break
          }
          break
        case 419:
          switch (this.currentDirection) {
            case 1:
              if (this.proposedDirection !== -1) {
                this.currentDirection = -27
              }
              break
            case 27:
              if (this.proposedDirection !== 1) {
                this.currentDirection = -1
              } else {
                this.currentDirection = -27
              }
              break
          }
          break
      }
      const proposedPos = this.currentIndex + this.proposedDirection
      const predictedPos = this.currentIndex + this.currentDirection
      if (openSquares.includes(wallsArray[proposedPos])) {
        this.currentDirection = this.proposedDirection
      } else if (openSquares.includes(wallsArray[predictedPos])) {
        this.currentDirection = this.currentDirection
      } else {
        this.currentDirection = 0
      }

      this.currentIndex += this.currentDirection

      this.storeCoordinates()

      this.previousIndex = this.currentIndex - this.currentDirection

      if (squares[this.currentIndex].classList.contains('food')) {
        squares[this.currentIndex].classList.remove('food')
        score += 10
        if (score > highScore) {
          highScore = score
        }
        highScoreDisplay.innerHTML = highScore
      } else if (squares[this.currentIndex].classList.contains('energizer')) {
        score += 50
        if (score > highScore) {
          highScore = score
        }
        highScoreDisplay.innerHTML = highScore
      }
      squares.forEach(square => square.classList.remove(this.name))
      squares.forEach(square => square.classList.remove(pacManMouthArray[this.pacManMouthArrayIndex % 4]))
      squares[this.currentIndex].classList.add(this.name)
      squares[this.currentIndex].classList.add(pacManMouthArray[this.pacManMouthArrayIndex % 4])
      switch (this.currentDirection) {
        case 1:
          squares[this.currentIndex].classList.add('rotate0')
          break
        case -1:
          squares[this.currentIndex].classList.add('rotate180')
          break
        case 28:
          squares[this.currentIndex].classList.add('rotate90')
          break
        case -28:
          squares[this.currentIndex].classList.add('rotate270')
          break
      }
      squares[this.previousIndex].classList.remove('rotate0')
      squares[this.previousIndex].classList.remove('rotate90')
      squares[this.previousIndex].classList.remove('rotate180')
      squares[this.previousIndex].classList.remove('rotate270')
      this.pacManMouthArrayIndex++
      currentScoreDisplay.innerHTML = score
    }
    handleKeyDown(e) {
      switch (e.keyCode) {
        case 39: // right arrow
          pacMan.proposedDirection = 1
          break
        case 37: // left arrow
          pacMan.proposedDirection = -1
          break
        case 40: // down arrow
          pacMan.proposedDirection = width
          break
        case 38: // up arrow
          pacMan.proposedDirection = -width
      }
    }
  }

  const pacMan = new Player('pacman', 658, -1, 659, 658, -1, -1, 0)
  squares[pacMan.currentIndex].classList.add('pacman')
  squares[pacMan.currentIndex].classList.add('half') // put pacman in starting position

  const redGhost = new Characters('red', 322, 1, 321, 322, 1, 404)
  squares[redGhost.currentIndex].classList.add('red')

  const blueGhost = new Characters('blue', 405, -28, 432, 405, -28, 405)
  squares[blueGhost.currentIndex].classList.add('blue')

  const orangeGhost = new Characters('orange', 406, -28, 433, 406, -28, 406)
  squares[orangeGhost.currentIndex].classList.add('orange')

  const pinkGhost = new Characters('pink', 407, -1, 408, 407, -1, 407)
  squares[pinkGhost.currentIndex].classList.add('pink')

  const ghostArray = [redGhost, blueGhost, orangeGhost, pinkGhost]

  // CHARACTER MOVEMENT FUNCTIONS

  function playerMove () {
    pacMan.automaticMovement()
    window.addEventListener('keydown', pacMan.handleKeyDown)
  }

  function redGhostChase () {
    redGhost.chase()
  }

  function blueGhostChase () {
    blueGhost.chase()
  }

  function orangeGhostChase () {
    orangeGhost.chase()
  }

  function pinkGhostChase () {
    pinkGhost.chase()
  }

  // ONGOING CHECKING FUNCTIONS

  function checkDeathAll () {
    // console.log('checking death')
    for (const eachGhost of ghostArray) {
      if (eachGhost.chaseStatus === 'Y' && ((pacMan.currentIndex === eachGhost.currentIndex) || ((pacMan.currentIndex === eachGhost.previousIndex) && (pacMan.previousIndex === eachGhost.currentIndex)))) {
        window.removeEventListener('keydown', pacMan.handleKeyDown)
        clearInterval(timerId2)
        clearInterval(timerId3)
        clearInterval(timerId4)
        clearInterval(timerId5)
        clearInterval(timerId6)
        clearInterval(timerId7)
        clearInterval(timerId8)
        clearInterval(timerId9)
        clearInterval(timerId10)
        clearInterval(timerId11)
        clearInterval(timerId12)
        clearInterval(timerId13)
        squares.forEach(square => square.classList.remove('pacman'))
        squares.forEach(square => square.classList.remove('red'))
        squares.forEach(square => square.classList.remove('blue'))
        squares.forEach(square => square.classList.remove('orange'))
        squares.forEach(square => square.classList.remove('pink'))
        pacMan.currentIndex = pacMan.startingIndex
        pacMan.currentDirection = pacMan.startingDirection
        pacMan.proposedDirection = pacMan.startingDirection
        for (const eachGhost of ghostArray) {
          eachGhost.currentIndex = eachGhost.startingIndex
          eachGhost.currentDirection = eachGhost.startingDirection
          eachGhost.captureTime = 0
          eachGhost.scatterTime = 0
          eachGhost.scatterStatus = 'N'
          eachGhost.inPenOrNot = 'N'
          eachGhost.chaseStatus = 'Y'
        }
        squares[pacMan.currentIndex].classList.add('pacman')
        squares[redGhost.currentIndex].classList.add('red')
        squares[blueGhost.currentIndex].classList.add('blue')
        squares[orangeGhost.currentIndex].classList.add('orange')
        squares[pinkGhost.currentIndex].classList.add('pink')
        lives--
        if (lives >= 0) {
          countDownTime = 3
          livesDisplay.innerHTML = `${lives} lives left`
          startTimer()
        } else {
          livesDisplay.innerHTML = 'hit space to restart'
          countdownDisplay.innerHTML = 'GAME OVER'
          countdownDisplay.classList.add('game-over')
          for (let i = 0; i < width * height; i++) {
            if (wallsArray[i] === 'F' || wallsArray[i] === 'X') {
              squares[i].classList.add('food')
            } else if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
              squares[i].classList.add('energizer')
            }
          }
          level = 1
          score = 0
          countDownTime = 3
          lives = 2
          window.addEventListener('keydown', spaceDown)
        }
      }
    }
  }

  function checkLevelUp () {
    const foodLeft = squares.filter(square => square.classList.contains('food'))
    if (foodLeft.length === 0) {
      window.removeEventListener('keydown', pacMan.handleKeyDown)
      clearInterval(timerId2)
      clearInterval(timerId3)
      clearInterval(timerId4)
      clearInterval(timerId5)
      clearInterval(timerId6)
      clearInterval(timerId7)
      clearInterval(timerId8)
      clearInterval(timerId9)
      clearInterval(timerId10)
      clearInterval(timerId11)
      clearInterval(timerId12)
      clearInterval(timerId13)
      squares.forEach(square => square.classList.remove('pacman'))
      squares.forEach(square => square.classList.remove('red'))
      squares.forEach(square => square.classList.remove('blue'))
      squares.forEach(square => square.classList.remove('orange'))
      squares.forEach(square => square.classList.remove('pink'))
      pacMan.currentIndex = 658
      pacMan.currentDirection = -1
      pacMan.proposedDirection = -1
      redGhost.currentIndex = 322
      redGhost.currentDirection = 1
      blueGhost.currentIndex = 405
      blueGhost.currentDirection = -28
      orangeGhost.currentIndex = 406
      orangeGhost.currentDirection = -28
      pinkGhost.currentIndex = 407
      pinkGhost.currentDirection = -21
      squares[pacMan.currentIndex].classList.add('pacman')
      squares[redGhost.currentIndex].classList.add('red')
      squares[blueGhost.currentIndex].classList.add('blue')
      squares[orangeGhost.currentIndex].classList.add('orange')
      squares[pinkGhost.currentIndex].classList.add('pink')
      countDownTime = 3
      ghostSpeed -= 10
      level++
      levelDisplay.innerHTML = level
      for (const eachGhost in ghostArray) {
        eachGhost.captureTime = 0
        eachGhost.scatterTime = 0
        eachGhost.scatterStatus = 'N'
        eachGhost.inPenOrNot = 'N'
        eachGhost.chaseStatus = 'Y'
      }
      for (let i = 0; i < width * height; i++) {
        if (wallsArray[i] === 'F' || wallsArray[i] === 'X') {
          squares[i].classList.add('food')
        } else if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
          squares[i].classList.add('energizer')
        }
      }
      startTimer()
    }
  }

  function checkEnergizer () {
    if (squares[pacMan.currentIndex].classList.contains('energizer')) {

      squares[pacMan.currentIndex].classList.remove('energizer')
      squares[pacMan.currentIndex].classList.remove('flash')
      
      clearInterval(timerId3)
      clearInterval(timerId4)
      clearInterval(timerId5)
      clearInterval(timerId6)
      clearInterval(timerId7)
      
      for (const eachGhost of ghostArray) {
        if (eachGhost.scatterTime === 0) {
          eachGhost.scatterStatus = 'Y'
        } else if (eachGhost.scatterTime > 0 && eachGhost.scatterTime <= 15 && eachGhost.inPenOrNot === 'N') {
          eachGhost.scatterTime = 0
        }
      }
    }
  }

  function checkGhostsScatterAll () {
    ghostArray.forEach(ghost => ghost.scatter())
  }

  function checkGhostCaptureAll () {
    ghostArray.forEach(ghost => ghost.checkGhostCapture())
  }

  function checkGhostInPenAll () {
    ghostArray.forEach(ghost => ghost.checkInPenOrNot())
  }

  function checkPenStyle () {
    for (const eachGhost of ghostArray) {
      if (eachGhost.inPenOrNot === 'N') {
        squares[eachGhost.penPosition].classList.remove('scatter')
      }
    }
  }

  // TIMERS

  function startTimer () {
    timerId1 = setInterval(countDownTimer, 1000)
  }

  function countDownTimer () {
    countdownDisplay.classList.remove('hidden')
    countdownDisplay.classList.remove('game-over')
    if (countDownTime >= 3) {
      countdownDisplay.innerHTML = 'three'
      countDownTime--
    } else if (countDownTime === 2) {
      countdownDisplay.innerHTML = 'two'
      countDownTime--
    } else if (countDownTime === 1) {
      countdownDisplay.innerHTML = 'one'
      countDownTime--
    } else if (countDownTime === 0) {
      countdownDisplay.innerHTML = 'go!'
      playerTimer()
      redChaseTimer()
      blueChaseTimer()
      orangeChaseTimer()
      pinkChaseTimer()
      checkDeathTimer()
      levelUpTimer()
      energizerTimer()
      checkGhostScatterTimer()
      checkGhostCaptureTimer()
      penTimer()
      checkPenStyleTimer()
      window.removeEventListener('keydown', spaceDown)
      countDownTime--
    } else if (countDownTime <= -1) {
      for (let i = 0; i < width * height; i++) {
        if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
          squares[i].classList.add('flash')
        }
      }
      countdownDisplay.classList.add('hidden')
      clearInterval(timerId1)
    }
  }

  function playerTimer () {
    timerId2 = setInterval(playerMove, playerSpeed)
  }

  function redChaseTimer () {
    timerId3 = setInterval(redGhostChase, ghostSpeed)
  }

  function blueChaseTimer () {
    timerId4 = setInterval(blueGhostChase, ghostSpeed)
  }

  function orangeChaseTimer () {
    timerId5 = setInterval(orangeGhostChase, ghostSpeed)
  }

  function pinkChaseTimer () {
    timerId6 = setInterval(pinkGhostChase, ghostSpeed)
  }

  function checkDeathTimer () {
    timerId7 = setInterval(checkDeathAll)
  }
  
  function levelUpTimer () {
    timerId8 = setInterval(checkLevelUp)
  }

  function energizerTimer () {
    timerId9 = setInterval(checkEnergizer)
  }

  function checkGhostScatterTimer () {
    timerId10 = setInterval(checkGhostsScatterAll, ghostSpeed * 3)
  }

  function checkGhostCaptureTimer () {
    timerId11 = setInterval(checkGhostCaptureAll)
  }

  function penTimer () {
    timerId12 = setInterval(checkGhostInPenAll, 1)
  }

  function checkPenStyleTimer () {
    timerId13 = setInterval(checkPenStyle)
  }

  // EVENT HANDLERS

  window.addEventListener('keydown', spaceDown)

  function spaceDown (e) {
    if (e.keyCode === 32) {
      startTimer()
      levelDisplay.innerHTML = level
      currentScoreDisplay.innerHTML = '00'
      livesDisplay.innerHTML = `${lives} lives left`
    }
  }
}

window.addEventListener('DOMContentLoaded', init)