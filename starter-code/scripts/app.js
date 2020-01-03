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
  let countDownTime = 0 // countdown starts from 3 before game starts
  let gameTime = 0 // gameTime begins after countdown and starts from 0

  const playerSpeed = 100
  let ghostSpeed = 100

  // wallsArray constants
  const F = 'F' // food
  const N = 'N' // nothing
  const L = 'L' // ghost goes left
  const U = 'U' // ghost goes up
  const R = 'R' // ghost goes right
  const D = 'D' // door to pen
  const B = 'B' // big food

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
    1,F,F,F,F,F,F,F,F,F,F,F,F,1,1,F,F,F,F,F,F,F,F,F,F,F,F,1,
    1,F,6,0,0,7,F,6,0,0,0,7,F,1,1,F,6,0,0,0,7,F,6,0,0,7,F,1,
    1,B,1,N,N,1,F,1,N,N,N,1,F,1,1,F,1,N,N,N,1,F,1,N,N,1,B,1,
    1,F,9,0,0,8,F,9,0,0,0,8,F,9,8,F,9,0,0,0,8,F,9,0,0,8,F,1,
    1,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,1,
    1,F,6,0,0,7,F,6,7,F,6,0,0,0,0,0,0,7,F,6,7,F,6,0,0,7,F,1,
    1,F,9,0,0,8,F,1,1,F,9,0,0,3,2,0,0,8,F,1,1,F,9,0,0,8,F,1,
    1,F,F,F,F,F,F,1,1,F,F,F,F,1,1,F,F,F,F,1,1,F,F,F,F,F,F,1,
    5,0,0,0,0,7,F,1,5,0,0,7,N,1,1,N,6,0,0,4,1,F,6,0,0,0,0,4,
    N,N,N,N,N,1,F,1,2,0,0,8,N,9,8,N,9,0,0,3,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,N,N,N,N,N,N,N,N,N,N,1,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,N,6,0,0,D,D,0,0,7,N,1,1,F,1,N,N,N,N,N,
    0,0,0,0,0,8,F,9,8,N,1,R,R,U,U,L,L,1,N,9,8,F,9,0,0,0,0,0,
    N,N,N,N,N,N,F,N,N,N,1,R,R,U,U,L,L,1,N,N,N,F,N,N,N,N,N,N,
    0,0,0,0,0,7,F,6,7,N,1,R,R,U,U,L,L,1,N,6,7,F,6,0,0,0,0,0,
    N,N,N,N,N,1,F,1,1,N,9,0,0,0,0,0,0,8,N,1,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,N,N,N,N,N,N,N,N,N,N,1,1,F,1,N,N,N,N,N,
    N,N,N,N,N,1,F,1,1,N,6,0,0,0,0,0,0,7,N,1,1,F,1,N,N,N,N,N,
    2,0,0,0,0,8,F,9,8,N,9,0,0,3,2,0,0,8,N,9,8,F,9,0,0,0,0,3,
    1,F,F,F,F,F,F,F,F,F,F,F,F,1,1,F,F,F,F,F,F,F,F,F,F,F,F,1,
    1,F,6,0,0,7,F,6,0,0,0,7,F,1,1,F,6,0,0,0,7,F,6,0,0,7,F,1,
    1,F,9,0,3,1,F,9,0,0,0,8,F,9,8,F,9,0,0,0,8,F,1,2,0,8,F,1,
    1,B,F,F,1,1,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,1,1,F,F,B,1,
    5,0,7,F,1,1,F,6,7,F,6,0,0,0,0,0,0,7,F,6,7,F,1,1,F,6,0,4,
    2,0,8,F,9,8,F,1,1,F,9,0,0,3,2,0,0,8,F,1,1,F,9,8,F,9,0,3,
    1,F,F,F,F,F,F,1,1,F,F,F,F,1,1,F,F,F,F,1,1,F,F,F,F,F,F,1,
    1,F,6,0,0,0,0,4,5,0,0,7,F,1,1,F,6,0,0,4,5,0,0,0,0,7,F,1,
    1,F,9,0,0,0,0,0,0,0,0,8,F,9,8,F,9,0,0,0,0,0,0,0,0,8,F,1,
    1,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,1,
    5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4]

  // loop through walls array to build walls
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
      case D:
        squares[i].classList.add('door')
        break
      case F:
        squares[i].classList.add('food')
        break
      case B:
        squares[i].classList.add('big-food')
        break
    }
  }

  // create Ghost class with properties and movement method
  class Characters {
    constructor(name, previousIndex, currentIndex, currentDirection) {
      this.name = name, // colour of ghost
      this.previousIndex = previousIndex // previous position
      this.currentIndex = currentIndex // current position
      this.currentRow = Math.ceil((this.currentIndex + 1) / width)
      this.currentColumn = ((this.currentIndex + 1) % width) === 0 ? width : ((this.currentIndex + 1) % width)
      this.currentDirection = currentDirection, // current direction
      this.directionArray = [1, -1, 28, -28, 27, -27], // array of possible directions, to be filtered down
      this.whereToGo = [] // empty array to be filled with available directions
    }
    storeCoordinates () {
      this.currentRow = Math.ceil((this.currentIndex + 1) / width)
      this.currentColumn = ((this.currentIndex + 1) % width) === 0 ? width : ((this.currentIndex + 1) % width)
    }
    specialTiles () {
      if (wallsArray[this.currentIndex] === 'R') { // if ghost is on left hand side of pen, it should go right
        this.currentDirection = 1
      } else if (wallsArray[this.currentIndex] === 'L') { // if ghost is on right hand side of pen, it should go left
        this.currentDirection = -1
      } else if (wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D') { // if ghost is down the middle of the pen, it should go up
        this.currentDirection = -28
      } else if (this.currentIndex === 392) { // if ghost is crossing hole in the wall, make sure it continues correctly
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

      this.directionArray = [1, -1, 28, -28]

      // If there is no wall in same direction the ghost is already going, then remove opposite direction from options

      if (wallsArray[nextAlong] === 'F' || wallsArray[nextAlong] === 'B' || wallsArray[nextAlong] === 'N') {
        this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== ((-1) * (this.currentDirection)))
      }
      
      this.whereToGo = []

      for (const eachDirection of this.directionArray) { // loop through all options left of where ghost can go
        const potentialPos = this.currentIndex + eachDirection
        if (wallsArray[potentialPos] === 'F' || wallsArray[potentialPos] === 'B' || wallsArray[potentialPos] === 'N') {
          this.whereToGo.push(eachDirection) // push all directions left where there won't be a wall to whereToGo
        }
      }

      const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
      this.currentDirection = this.whereToGo[randomNumber] // choose direction from array based off random number

    }
    updateGrid () {
      // update next ghost position by adding direction to current position
      this.currentIndex = this.currentIndex + this.currentDirection

      // store previous position, useful for checkDeath
      this.previousIndex = this.currentIndex - this.currentDirection
      
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.currentIndex].classList.add(this.name)
    }
    redChaseAggresive () {
      if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
        this.specialTiles()
      } else {

        // Add one smart direction to the direction array. If ghost can go that way then it will be in there twice now, increasing the chance of it going that way. If the ghost cannot go that way then it will not be considered at all for the next direction

        let smartDirection = null
        const rowDifference = this.currentRow - pacMan.currentRow
        const columnDifference = this.currentColumn - pacMan.currentColumn
        const positiveRowDifference = rowDifference < 0 ? -rowDifference : rowDifference
        const positiveColumnDifference = columnDifference < 0 ? -columnDifference : columnDifference
        const randomNumberSmart = Math.floor(Math.random() * 2)
        let smartDirectionsArray = []

        if (positiveRowDifference > positiveColumnDifference) {
          if (rowDifference > 0) {
            smartDirection = -28
          } else {
            smartDirection = 28
          }
        } else if (positiveColumnDifference > positiveRowDifference) {
          if (columnDifference > 0) {
            smartDirection = -1
          } else {
            smartDirection = 1
          }
        } else {
          if (rowDifference > 0 && columnDifference > 0) {
            smartDirectionsArray = [-1, -28]
          } else if (rowDifference > 0 && columnDifference < 0) {
            smartDirectionsArray = [1, -28]
          } else if (rowDifference < 0 && columnDifference > 0) {
            smartDirectionsArray = [-1, 28]
          } else {
            smartDirectionsArray = [1, 28]
          }
          smartDirection = smartDirectionsArray[randomNumberSmart]
        }

        this.directionArray = [1, -1, 28, -28]

        this.directionArray.push(smartDirection)
        // this.directionArray.push(smartDirection)
        // this.directionArray.push(smartDirection)

        this.standardTiles()
      }
      
      this.storeCoordinates()
      this.updateGrid()
    }
    blueChaseAggresive () {
      if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
        this.specialTiles()
      } else {
        this.standardTiles()
      }
      this.updateGrid()
    }
    orangeChaseAggresive() {
      if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
        this.specialTiles()
      } else {
        this.standardTiles()
      }
      this.updateGrid()
    }
    pinkChaseAggresive() {
      if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
        this.specialTiles()
      } else {
        this.standardTiles()
      }
      this.updateGrid()
    }
    scatter() {
      for (let i = gameTime; i < (gameTime + 10); i++) {
        console.log('yo')
      }
    }
  }

  class Player extends Characters {
    constructor(name, previousIndex, currentIndex, currentDirection, proposedDirection) {
      super(name, previousIndex, currentIndex, currentDirection)
      this.proposedDirection = proposedDirection
    }
    automaticMovement () {
      switch (this.currentIndex) {
        case 392:
          switch (this.proposedDirection) {
            case -1:
              this.proposedDirection = 27
              break
            case -27:
              this.proposedDirection = 1
              break
          }
          break
        case 419:
          switch (this.proposedDirection) {
            case 1:
              this.proposedDirection = -27
              break
            case 27:
              this.proposedDirection = -1
              break
          }
          break
      }
      const proposedPos = this.currentIndex + this.proposedDirection
      const predictedPos = this.currentIndex + this.currentDirection
      if (wallsArray[proposedPos] === 'F' || wallsArray[proposedPos] === 'B' || wallsArray[proposedPos] === 'N') {
        this.currentDirection = this.proposedDirection
      } else if (wallsArray[predictedPos] === 'F' || wallsArray[proposedPos] === 'B' || wallsArray[predictedPos] === 'N') {
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
      } else if (squares[this.currentIndex].classList.contains('big-food')) {
        squares[this.currentIndex].classList.remove('big-food')
        score += 50
        if (score > highScore) {
          highScore = score
        }
        highScoreDisplay.innerHTML = highScore
      }
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.currentIndex].classList.add(this.name)
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

  const pacMan = new Player('pacman', 659, 658, -1, -1)
  squares[pacMan.currentIndex].classList.add('pacman') // put pacman in starting position

  const redGhost = new Characters('red', 321, 322, 1)
  squares[redGhost.currentIndex].classList.add('red')

  const blueGhost = new Characters('blue', 403, 404, 1)
  squares[blueGhost.currentIndex].classList.add('blue')

  const orangeGhost = new Characters('orange', 432, 405, -28)
  squares[orangeGhost.currentIndex].classList.add('orange')

  const pinkGhost = new Characters('pink', 433, 406, -28)
  squares[pinkGhost.currentIndex].classList.add('pink')

  const ghostArray = [redGhost, blueGhost, orangeGhost, pinkGhost]

  function checkDeath () {
    for (let i = 0; i < ghostArray.length; i++) {
      if ((pacMan.currentIndex === ghostArray[i].currentIndex) || ((pacMan.currentIndex === ghostArray[i].previousIndex) && (pacMan.previousIndex === ghostArray[i].currentIndex))) {
        clearInterval(timerId2)
        clearInterval(timerId3)
        clearInterval(timerId4)
        clearInterval(timerId5)
        window.removeEventListener('keydown', pacMan.handleKeyDown)
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
        blueGhost.currentIndex = 404
        blueGhost.currentDirection = 1
        orangeGhost.currentIndex = 405
        orangeGhost.currentDirection = -28
        pinkGhost.currentIndex = 406
        pinkGhost.currentDirection = -28
        squares[pacMan.currentIndex].classList.add('pacman')
        squares[redGhost.currentIndex].classList.add('red')
        squares[blueGhost.currentIndex].classList.add('blue')
        squares[orangeGhost.currentIndex].classList.add('orange')
        squares[pinkGhost.currentIndex].classList.add('pink')
        lives--
        if (lives >= 0) {
          countDownTime = 3
          gameTime = 0
          livesDisplay.innerHTML = `${lives} lives left`
          startTimers()
        } else {
          livesDisplay.innerHTML = 'hit space to restart'
          countdownDisplay.innerHTML = 'GAME OVER'
          countdownDisplay.classList.add('game-over')
          for (let i = 0; i < width * height; i++) {
            if (wallsArray[i] === 'F') {
              squares[i].classList.add('food')
            } else if (wallsArray[i] === 'B') {
              squares[i].classList.add('big-food')
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
      clearInterval(timerId2)
      clearInterval(timerId3)
      window.removeEventListener('keydown', pacMan.handleKeyDown)
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
      blueGhost.currentIndex = 404
      blueGhost.currentDirection = 1
      orangeGhost.currentIndex = 405
      orangeGhost.currentDirection = -28
      pinkGhost.currentIndex = 406
      pinkGhost.currentDirection = -28
      squares[pacMan.currentIndex].classList.add('pacman')
      squares[redGhost.currentIndex].classList.add('red')
      squares[blueGhost.currentIndex].classList.add('blue')
      squares[orangeGhost.currentIndex].classList.add('orange')
      squares[pinkGhost.currentIndex].classList.add('pink')
      clearInterval(timerId4)
      clearInterval(timerId5)
      countDownTime = 3
      gameTime = 0
      level++
      levelDisplay.innerHTML = level
      ghostSpeed -= 10
      for (let i = 0; i < width * height; i++) {
        if (wallsArray[i] === 'F') {
          squares[i].classList.add('food')
        } else if (wallsArray[i] === 'B') {
          squares[i].classList.add('big-food')
        }
      }
      startTimers()
    }
  }

  function checkBigFood () {
    const bigFoodArray = []
    for (let i = 0; i < wallsArray.length; i++) {
      if (wallsArray[i] === B) {
        bigFoodArray.push(i)
      }
    }
    for (let i = 0; i < bigFoodArray.length; i++) {
      if (pacMan.currentIndex === bigFoodArray[i]) {
        ghostArray.forEach(ghost => ghost.scatter())
        clearInterval(timerId6)
      }
    }
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
      countDownTime--
    } else {
      countdownDisplay.classList.add('hidden')
      clearInterval(timerId1)
    }
  }

  function gameTimer () {
    if (countDownTime < 0) {
      gameTime++
      // console.log(gameTime)
    }
  }

  function playerMove () {
    if (countDownTime < 0) {
      pacMan.automaticMovement()
      window.addEventListener('keydown', pacMan.handleKeyDown)
    }
  }

  function ghostsMove () {
    if (countDownTime < 0) {
      redGhost.redChaseAggresive()
      blueGhost.blueChaseAggresive()
      orangeGhost.orangeChaseAggresive()
      pinkGhost.pinkChaseAggresive()
    }
  }

  function spaceDown (e) {
    if (e.keyCode === 32) {
      startTimers()
      levelDisplay.innerHTML = level
      currentScoreDisplay.innerHTML = '00'
      livesDisplay.innerHTML = `${lives} lives left`
    }
  }

  function startTimers () {
    timerId1 = setInterval(countDownTimer, 1000)
    timerId2 = setInterval(playerMove, playerSpeed)
    timerId3 = setInterval(ghostsMove, ghostSpeed)
    timerId4 = setInterval(checkDeath)
    timerId5 = setInterval(checkLevelUp)
    timerId6 = setInterval(checkBigFood)
    timerId7 = setInterval(gameTimer, 1000)
    window.removeEventListener('keydown', spaceDown)
  }

  // EVENT HANDLERS
  window.addEventListener('keydown', spaceDown)
}

window.addEventListener('DOMContentLoaded', init)