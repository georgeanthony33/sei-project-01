function init() {

  //  DOM VARIABLES
  const levelDisplay = document.querySelector('h2#level')
  const grid = document.querySelector('.grid') // grab grid div
  const countdown = document.querySelector('h2.countdown') // grab countdown display
  const currentScoreDisplay = document.querySelector('h2#current-score')
  const highScoreDisplay = document.querySelector('h2#high-score')
  const livesDisplay = document.querySelector('h2#lives-left')

  // GAME VARIABLES
  const squares = [] // squares within grid
  const width = 28 // number of squares across
  const height = 31 // number of squares down
  const directionArray = [1, -1, 28, -28, 27, -27]
  const directionObject = {
    '-1': 'right',
    '1': 'left',
    '28': 'top',
    '-28': 'bottom'
  }
  let level = 1
  let score = 0 // initial score
  let highScore = 0
  let lives = 2 // initial lives -> die if lives < 0
  let timerId1 = null
  let timerId2 = null
  let timerId3 = null
  let timerId4 = null
  let timerId5 = null
  let countDownTime = 1 // countdown starts from 3 before game starts
  // let gameTime = 0 // gameTime begins after countdown and starts from 0
  const playerSpeed = 1000
  let ghostSpeed = 1000

  // SET INITIAL DOM VARIABLES
  levelDisplay.innerHTML = level
  currentScoreDisplay.innerHTML = '00'
  highScoreDisplay.innerHTML = '00'
  countdown.innerHTML = 'hit space'
  livesDisplay.innerHTML = `${lives} lives left`
  
  // loop as many times as width times the height to fill the grid
  Array(width * height).join('.').split('.').forEach(() => { // create array with (width * height) empty elements ''
    const square = document.createElement('div') // create a square for each element
    square.classList.add('grid-item') // add grid-item class to each square
    squares.push(square) // push square to squares array
    grid.appendChild(square) // append square to the grid div
  })

  // create wall array: 1 = wall, 0 = food, 2 = ghosts go right 3 = ghosts go left, 4 = ghosts go up
  const wallsArray = [
    6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 5, 5, 1, 0, 1, 5, 5, 5, 1, 0, 1, 1, 0, 1, 5, 5, 5, 1, 0, 1, 5, 5, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 7, 6, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    8, 1, 1, 1, 1, 1, 0, 1, 8, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 9, 1, 0, 1, 1, 1, 1, 1, 9,
    5, 5, 5, 5, 5, 1, 0, 1, 6, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 7, 1, 0, 1, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 1, 0, 1, 1, 0, 1, 1, 1, 4, 4, 1, 1, 1, 0, 1, 1, 0, 1, 5, 5, 5, 5, 5,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 4, 4, 3, 3, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 4, 4, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 4, 4, 3, 3, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    5, 5, 5, 5, 5, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 5, 5, 5, 5, 5,
    6, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 7, 6, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 7,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 7, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 6, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    8, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 9,
    6, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 7, 6, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 7,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 9, 8, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 9, 8, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]

  // loop through walls array to build walls
  for (let i = 0; i < width * height; i++) {
    if (wallsArray[i] === 1) {
      squares[i].classList.add('wall')
      for (let j = 0; j < Object.keys(directionObject).length; j++) {
        if (wallsArray[i + directionArray[j]] === 0) {
          squares[i].classList.add(directionObject[directionArray[j]])
        }
      }
    } else if (wallsArray[i] === 6) {
      squares[i].classList.add('wall')
      squares[i].classList.add('right')
      squares[i].classList.add('bottom')
    } else if (wallsArray[i] === 7) {
      squares[i].classList.add('wall')
      squares[i].classList.add('left')
      squares[i].classList.add('bottom')
    } else if (wallsArray[i] === 8) {
      squares[i].classList.add('wall')
      squares[i].classList.add('right')
      squares[i].classList.add('top')
    } else if (wallsArray[i] === 9) {
      squares[i].classList.add('wall')
      squares[i].classList.add('left')
      squares[i].classList.add('top')
    }
  }

  // loop through walls array to place food
  for (let i = 0; i < width * height; i++) {
    if (wallsArray[i] === 0) {
      squares[i].classList.add('food')
    }
  }

  // create Ghost class with properties and movement method
  class Characters {
    constructor(name, previousIndex, currentIndex, currentDirection) {
      this.name = name, // colour of ghost
      this.previousIndex = previousIndex // previous position
      this.currentIndex = currentIndex // current position
      this.currentDirection = currentDirection, // current direction
      this.directionArray = [1, -1, 28, -28, 27, -27], // array of possible directions, to be filtered down
      this.whereToGo = [] // empty array to be filled with available directions
    }
    ghostMovementRules () {
      if (wallsArray[this.currentIndex] === 2) { // if ghost is on left hand side of cage, it should go right
        this.currentIndex++
        this.currentDirection = 1
      } else if (wallsArray[this.currentIndex] === 3) { // if ghost is on right hand side of cage, it should go left
        this.currentIndex--
        this.currentDirection = -1
      } else if (wallsArray[this.currentIndex] === 4) { // if ghost is down the middle of the cage, it should go up
        this.currentIndex -= 28
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
      } else {
        // nextAlong is the next position the ghost would be in if it follows same Direction
        const nextAlong = this.currentIndex + this.currentDirection
        this.directionArray = [1, -1, 28, -28]
        this.whereToGo = []
        if (wallsArray[nextAlong] === 0) {
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== ((-1) * (this.currentDirection)))
        } // if no wall in same direction ghost is already going then remove opposite direction from options
        for (const eachDirection of this.directionArray) { // loop through all options left of where ghost can go
          const potentialPos = this.currentIndex + eachDirection
          if (wallsArray[potentialPos] === 0) {
            this.whereToGo.push(eachDirection) // push all directions left where there won't be a wall to whereToGo
          }
        }
        // create n random numbers where n = number of directions available to ghost
        const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
        this.currentDirection = this.whereToGo[randomNumber] // choose direction from array based off random number
      }
      // update next ghost position by adding direction to current position
      this.currentIndex = this.currentIndex + this.currentDirection
      // store previous position, useful for checkDeath
      this.previousIndex = this.currentIndex - this.currentDirection
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.currentIndex].classList.add(this.name) // move ghost class along to updated position
    }
    redChaseAggresive () {
      this.ghostMovementRules()
      const indexDifference = pacMan.currentIndex - this.currentIndex
      const rowDifference = indexDifference / width
      const columnDifference = indexDifference % width
      console.log(rowDifference)
      console.log(columnDifference)
      if (rowDifference < 0 && columnDifference < rowDifference) {
        if (indexDifference < 0) {
          console.log('left')
        } else {
          console.log('right')
        }
      } else if (rowDifference > 0 && columnDifference > rowDifference) {
        if (indexDifference > 0) {
          console.log('right')
        } else {
          console.log('left')
        }
      } else if (columnDifference <= 0 && rowDifference < columnDifference) {
        console.log('up')
      } else if (columnDifference >= 0 && rowDifference > columnDifference) {
        console.log('down')
      } else {
        console.log('unknown')
      }
    }
    blueChaseAggresive () {
      this.ghostMovementRules()
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
      if (wallsArray[proposedPos] === 0) {
        this.currentDirection = this.proposedDirection
      } else if (wallsArray[predictedPos] === 0) {
        this.currentDirection = this.currentDirection
      } else {
        this.currentDirection = 0
      }
      this.currentIndex += this.currentDirection
      this.previousIndex = this.currentIndex - this.currentDirection
      if (squares[this.currentIndex].classList.contains('food')) {
        squares[this.currentIndex].classList.remove('food')
        score += 10
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

  const ghostArray = [redGhost, blueGhost]

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
        pacMan.currentIndex = 658
        pacMan.currentDirection = -1
        pacMan.proposedDirection = -1
        redGhost.currentIndex = 322
        redGhost.currentDirection = 1
        blueGhost.currentIndex = 405
        blueGhost.currentDirection = 1
        squares[pacMan.currentIndex].classList.add('pacman')
        squares[redGhost.currentIndex].classList.add('red')
        squares[blueGhost.currentIndex].classList.add('blue')
        lives--
        if (lives >= 0) {
          countDownTime = 3
          // gameTime = 0
          livesDisplay.innerHTML = `${lives} lives left`
          startTimers()
        } else {
          livesDisplay.innerHTML = 'hit space to restart'
          countdown.innerHTML = 'GAME OVER'
          countdown.classList.add('game-over')
          for (let i = 0; i < width * height; i++) {
            if (wallsArray[i] === 0) {
              squares[i].classList.add('food')
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
      pacMan.currentIndex = 658
      pacMan.currentDirection = -1
      pacMan.proposedDirection = -1
      redGhost.currentIndex = 322
      redGhost.currentDirection = 1
      blueGhost.currentIndex = 405
      blueGhost.currentDirection = 1
      squares[pacMan.currentIndex].classList.add('pacman')
      squares[redGhost.currentIndex].classList.add('red')
      squares[blueGhost.currentIndex].classList.add('blue')
      clearInterval(timerId4)
      clearInterval(timerId5)
      countDownTime = 3
      // gameTime = 0
      level++
      levelDisplay.innerHTML = level
      ghostSpeed -= 10
      for (let i = 0; i < width * height; i++) {
        if (wallsArray[i] === 0) {
          squares[i].classList.add('food')
        }
      }
      startTimers()
    }
  }

  function countDownTimer () {
    countdown.classList.remove('hidden')
    countdown.classList.remove('game-over')
    if (countDownTime >= 3) {
      countdown.innerHTML = 'three'
      countDownTime--
    } else if (countDownTime === 2) {
      countdown.innerHTML = 'two'
      countDownTime--
    } else if (countDownTime === 1) {
      countdown.innerHTML = 'one'
      countDownTime--
    } else if (countDownTime === 0) {
      countdown.innerHTML = 'go!'
      countDownTime--
    } else {
      countdown.classList.add('hidden')
      clearInterval(timerId1)
    }
  }

  function playerMove () {
    if (countDownTime < 0) {
      pacMan.automaticMovement()
      window.addEventListener('keydown', pacMan.handleKeyDown)
      // gameTime++
    }
  }

  function ghostsMove () {
    if (countDownTime < 0) {
      redGhost.redChaseAggresive()
      blueGhost.blueChaseAggresive()
      // gameTime++
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
    window.removeEventListener('keydown', spaceDown)
  }

  // EVENT HANDLERS
  window.addEventListener('keydown', spaceDown)
}

window.addEventListener('DOMContentLoaded', init)