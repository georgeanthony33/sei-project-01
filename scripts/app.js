function init() {

  //  DOM VARIABLES
  const levelDisplay = document.querySelector('h2#level')
  const currentScoreDisplay = document.querySelector('h2#current-score')
  const highScoreDisplay = document.querySelector('h2#high-score')
  const grid = document.querySelector('.grid') // grab grid div from HTML
  const countdownDisplay = document.querySelector('h2.countdown')
  const livesDisplay = document.querySelector('div.lives-left')
  const restartMessage = document.querySelector('h2.restart-message')
  
  // SOUND VARIABLES
  const audio = document.createElement('audio')
  const sirenAudio = document.createElement('audio')
  const chompAudio = document.createElement('audio')
  sirenAudio.loop = true
  chompAudio.loop = true
  const audioLinks = { // object for playSound function to refer to for audio links
    intro: 'https://vgmdownloads.com/soundtracks/pac-man-game-sound-effects/gmiffyvl/Intro.mp3',
    death: 'https://vgmdownloads.com/soundtracks/pac-man-game-sound-effects/yfkgsbwu/Death.mp3',
    eatEnergizer: 'https://vgmdownloads.com/soundtracks/pac-man-game-sound-effects/kfxtrstc/Fruit.mp3',
    eatGhost: 'https://vgmdownloads.com/soundtracks/pac-man-game-sound-effects/zaehkcsz/Ghost.mp3'
  }

  // GAME VARIABLES
  const squares = [] // squares within grid
  const width = 28 // number of squares across
  const height = 31 // number of squares down
  const playerDirectionObject = { // for rotation of PacMan
    '-1': '180deg',
    '1': '0deg',
    '28': '90deg',
    '-28': '270deg'
  }

  const livesArray = [] // for updating Lives
  const ghostsInPenArray = []

  let level = 1
  let score = 0
  let highScore = 0
  let lives = 2
  let livesDisplayArray = [1, 1] // 1 = life

  // SET INITIAL DOM VARIABLES
  levelDisplay.innerHTML = level
  currentScoreDisplay.innerHTML = '00'
  highScoreDisplay.innerHTML = '00'
  countdownDisplay.innerHTML = 'hit space'
  countdownDisplay.classList.add('flash')
  
  // TIMER VARIABLES
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
  let countDownTime = 3
  let ghostTime = 0 // starts when ghosts can move

  // SPEED VARIABLES
  let playerSpeed = null
  let ghostSpeed = null

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
    0,0,0,0,0,8,F,9,8,N,1,2,0,D,D,0,3,1,N,9,8,F,9,0,0,0,0,0,
    N,N,N,N,N,N,X,N,N,Z,1,1,R,U,U,L,1,1,Z,N,N,X,N,N,N,N,N,N,
    0,0,0,0,0,7,F,6,7,N,1,5,0,0,0,0,4,1,N,6,7,F,6,0,0,0,0,0,
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

  function updateLives () {
    livesDisplay.innerHTML = ''
    livesDisplayArray.forEach(() => {
      const life = document.createElement('div')
      life.classList.add('life')
      livesArray.push(life)
      livesDisplay.appendChild(life)
    })
  }

  function updateSpeeds (multiplier) {
    playerSpeed = Math.max((156 - (level * 6)), 120) // PacMan speed
    ghostSpeed = playerSpeed * 1.1 * multiplier // ghost speed with multiplier for frightened mode
    document.documentElement.style.setProperty('--ghostspeed', `${ghostSpeed / 1000}s`) // updates CSS animation speed
    document.documentElement.style.setProperty('--playerspeed', `${playerSpeed / 1000}s`) // updates CSS animation speed
  }

  updateLives()
  
  class Characters {
    constructor(name, startingIndex, startingDirection, previousIndex, currentIndex, currentDirection, penPosition, scatterTargetIndex) {
      this.name = name // colour of ghost
      this.startingIndex = startingIndex
      this.startingDirection = startingDirection
      this.previousIndex = previousIndex
      this.currentIndex = currentIndex
      this.currentDirection = currentDirection
      this.penPosition = penPosition
      this.scatterTargetIndex = scatterTargetIndex // where ghost aims for in scatter mode
      this.scatterTargetRow = Math.ceil((this.scatterTargetIndex + 1) / width)
      this.scatterTargetColumn = ((this.scatterTargetIndex + 1) % width) === 0 ? width : ((this.scatterTargetIndex + 1) % width)
      this.currentRow = Math.ceil((this.currentIndex + 1) / width)
      this.currentColumn = ((this.currentIndex + 1) % width) === 0 ? width : ((this.currentIndex + 1) % width)
      this.directionArray = [1, -1, 28, -28, 27, -27], // array of possible directions, to be filtered down on each tick
      this.openSquares = [F, X, E, Y, N, Z] // available tiles on grid
      this.whereToGo = [] // empty array to be filled with available directions on each tick
      this.scatterStatus = 'Y' // ghosts set to initially be in scatter mode
      this.chaseStatus = 'N'
      this.frightenedStatus = 'N'
      this.frightenedTime = 0
      this.captureStatus = 'N'
      this.captureTime = 0
      this.captureIndex = null
    }
    specialTiles () {
      if (this.captureStatus === 'N') {
        if (wallsArray[this.currentIndex] === 'R') { // if ghost is on left hand side of pen, it should go right
          this.currentDirection = 1
        } else if (wallsArray[this.currentIndex] === 'L') { // if ghost is on right hand side of pen, it should go left
          this.currentDirection = -1
        } else if (wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D') { // if ghost is down the middle of the pen, it should go up
          this.currentDirection = -28
        }
      } else {
        this.currentDirection = 0 // if ghost has been captured then it must not move until its capture time is finished
      }
      if (this.currentIndex === 392) { // if ghost is crossing tunnel in the wall, make sure it continues correctly
        switch (this.currentDirection) {
          case -1:
            this.currentDirection = 27
            break
          case -27:
            this.currentDirection = 1
            break
        }
      } else if (this.currentIndex === 419) { // if ghost is crossing tunnel in the wall, make sure it continues correctly
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
    standardTiles () { // rules for normal tiles
      const nextAlong = this.currentIndex + this.currentDirection // nextAlong is the next position the ghost would be in if it follows same direction
      this.directionArray = [1, -1, 28, -28]
      this.whereToGo = [] // empty array to be filled with directions of where ghost could go next
      this.openSquares = [F, X, E, Y, N, Z]
      if (openSquares.includes(wallsArray[nextAlong])) { // if there is no wall in same direction the ghost is already going, then remove opposite direction from options
        this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== ((-1) * (this.currentDirection)))
      }
      for (const eachDirection of this.directionArray) { // loop through all options left of where ghost can go
        const potentialPos = this.currentIndex + eachDirection
        if (openSquares.includes(wallsArray[potentialPos])) {
          this.whereToGo.push(eachDirection) // push all directions left where there won't be a wall to whereToGo
        }
      }
    }
    redSmartMove () { // from each direction available, get distance between potential next position and PacMan position
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
      for (let i = 0; i < smartDirectionsArray.length; i++) { // choose shortest distance
        if (smartDirectionsArray[i] < smartDirectionsArray[lowest]) {
          lowest = i
        }
      }
      const shortestDirection = this.whereToGo[lowest]
      this.whereToGo = []
      this.whereToGo.push(shortestDirection)
    }
    blueSmartMove () { // same as redSmartMove but ghost looks at position 2 tiles ahead of PacMan,
      const smartDirectionsArray = [] // ghost then draws line from red ghost to this position, doubles it and aims for there
      const redToTarget1RowDifference = redGhost.currentRow - pacMan.targetRowBlue
      const redToTarget1ColumnDifference = redGhost.currentColumn - pacMan.targetColumnBlue
      const target2Row = redGhost.currentRow - (redToTarget1RowDifference * 2) 
      const target2Column = redGhost.currentColumn - (redToTarget1ColumnDifference * 2)
      for (const eachDirection of this.whereToGo) {
        const potentialSmartPos = this.currentIndex + eachDirection
        const potentialSmartRow = Math.ceil((potentialSmartPos + 1) / width)
        const potentialSmartColumn = ((potentialSmartPos + 1) % width) === 0 ? width : ((potentialSmartPos + 1) % width)
        const smartRowDifference = potentialSmartRow - target2Row
        const smartColumnDifference = potentialSmartColumn - target2Column
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
    orangeSmartMove () { // same as redSmartMove when more than 8 tiles away from PacmMan
      const currentRowDifference = this.currentRow - pacMan.currentRow
      const currentColumnDifference = this.currentColumn - pacMan.currentColumn
      const currentDistance = Math.sqrt((currentRowDifference ** 2) + (currentColumnDifference ** 2))
      if (currentDistance > 8) {
        this.redSmartMove()
      } else {
        this.scatter() // at 8 or less tiles away from PacMan, ghost scatters
      }
    }
    pinkSmartMove () { // same as redSmartMove but ghost aims for position 4 tiles ahead of PacMan
      const smartDirectionsArray = []
      for (const eachDirection of this.whereToGo) {
        const potentialSmartPos = this.currentIndex + eachDirection
        const potentialSmartRow = Math.ceil((potentialSmartPos + 1) / width)
        const potentialSmartColumn = ((potentialSmartPos + 1) % width) === 0 ? width : ((potentialSmartPos + 1) % width)
        const smartRowDifference = potentialSmartRow - pacMan.targetRowPink
        const smartColumnDifference = potentialSmartColumn - pacMan.targetColumnPink
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
    chooseDirection () { // if ghost is in frightened mode, ghost chooses random direction from whereToGo array
      const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
      this.currentDirection = this.whereToGo[randomNumber]
    }
    updateGrid () {
      // update next ghost position by adding direction to current position
      this.currentIndex = this.currentIndex + this.currentDirection
      // store previous position, useful for checkDeath and checkGhostCapture
      this.previousIndex = this.currentIndex - this.currentDirection
      
      // update classes on the grid to show the ghost moving
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.previousIndex].classList.remove('ghost')
      squares[this.currentIndex].classList.add(this.name)
      squares[this.currentIndex].classList.add('ghost')
      this.characterAnimation()
    }
    characterAnimation () { // add class stating which direction any of the characters are moving so that CSS can apply appropriate styling and animation (the ghosts' eyes and PacMan's chomp)
      squares[this.previousIndex].classList.remove('left')
      squares[this.previousIndex].classList.remove('up')
      squares[this.previousIndex].classList.remove('right')
      squares[this.previousIndex].classList.remove('down')
      switch (this.currentDirection) {
        case -1:
          squares[this.currentIndex].classList.add('left')
          break
        case 1:
          squares[this.currentIndex].classList.add('right')
          break
        case -28:
          squares[this.currentIndex].classList.add('up')
          break
        case 28:
          squares[this.currentIndex].classList.add('down')
          break
        case 27:
          squares[this.currentIndex].classList.add('left')
          break
        case -27:
          squares[this.currentIndex].classList.add('right')
          break
      }
    }
    storeCurrentCoordinates (position) { // used for ghosts to decide which direction to take
      this.currentRow = Math.ceil((position + 1) / width)
      this.currentColumn = ((position + 1) % width) === 0 ? width : ((position + 1) % width)
    }
    storeScatterTarget () { // converting each ghost's target index position into row and column coordinates for scatter mode
      this.scatterRow = Math.ceil((this.scatterTargetIndex + 1) / width)
      this.scatterColumn = ((this.scatterTargetIndex + 1) % width) === 0 ? width : ((this.scatterTargetIndex + 1) % width)
    }
    scatter () {
      if (this.scatterStatus === 'Y') {
        this.whereToGo = [] // start with empty array of where ghost might go
        if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
          this.specialTiles()
        } else {
          this.standardTiles()
          this.storeScatterTarget()
          // from the possible directions each ghost can go, evaluate which move takes the ghost closest to its scatter target tile at that moment. This will result in each ghost patrolling one corner of the grid
          const smartDirectionsArray = []
          for (const eachDirection of this.whereToGo) {
            const potentialSmartPos = this.currentIndex + eachDirection
            const potentialSmartRow = Math.ceil((potentialSmartPos + 1) / width)
            const potentialSmartColumn = ((potentialSmartPos + 1) % width) === 0 ? width : ((potentialSmartPos + 1) % width)
            const smartRowDifference = potentialSmartRow - this.scatterRow
            const smartColumnDifference = potentialSmartColumn - this.scatterColumn
            const potentialDistance = Math.sqrt((smartRowDifference ** 2) + (smartColumnDifference ** 2))
            smartDirectionsArray.push(potentialDistance)
          }
          let lowest = 0
          for (let i = 0; i < smartDirectionsArray.length; i++) {
            if (smartDirectionsArray[i] < smartDirectionsArray[lowest]) {
              lowest = i
            }
          }
          const shortestDirection = this.whereToGo[lowest] // choose the shortest direction towards scatter target
          this.whereToGo = []
          this.whereToGo.push(shortestDirection)

          this.chooseDirection()
        }
        this.updateGrid() // move ghost along through CSS class change
        this.storeCurrentCoordinates(this.currentIndex)
      }
    }
    chase () {
      if (this.chaseStatus === 'Y') {
        if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
          this.specialTiles()
        } else {
          this.standardTiles()
          if (this.name === 'red') {
            this.redSmartMove()
          } else if (this.name === 'blue') {
            this.blueSmartMove()
          } else if (this.name === 'orange') {
            this.orangeSmartMove()
          } else if (this.name === 'pink') {
            this.pinkSmartMove()
          }
          this.chooseDirection()
        }
        this.updateGrid()
        this.storeCurrentCoordinates(this.currentIndex)
      }
    }
    frightened() {
      if (this.frightenedStatus === 'Y') {
        updateSpeeds(2) // ghosts move twice as slowly
        this.chaseStatus = 'N'
        this.scatterStatus = 'N'
        if (wallsArray[this.currentIndex] === 'R' || wallsArray[this.currentIndex] === 'L' || wallsArray[this.currentIndex] === 'U' || wallsArray[this.currentIndex] === 'D' || this.currentIndex === 392 || this.currentIndex === 419) {
          this.specialTiles()
        } else {
          this.standardTiles()
          this.chooseDirection()
        }
        this.updateGrid()
        this.storeCurrentCoordinates(this.currentIndex)

        squares[this.previousIndex].classList.remove('frightened')
        squares[this.currentIndex].classList.add('frightened')

        this.frightenedTime++

        if (this.frightenedTime > ((4 / 3) * (14 - level))) { // frightened mode lasts around 7 seconds and gets shorter with each level
          for (const eachGhost of ghostArray) {
            if (eachGhost.frightenedStatus === 'Y' && eachGhost.captureStatus === 'N') {
              if (this.frightenedTime % 2 === 0) { // ghosts flash blue and white in frightened mode
                squares[eachGhost.previousIndex].classList.remove('ghost-flash')
                squares[eachGhost.currentIndex].classList.add('ghost-flash')
              } else {
                squares[eachGhost.previousIndex].classList.remove('ghost-flash')
              }
            }
          }
        }

        if (this.frightenedTime > (2 * (14 - level))) { // frightened mode finishing
          updateSpeeds(1) // ghosts return to normal speed
          this.frightenedStatus = 'N'
          this.frightenedTime = 0
          squares.forEach(square => square.classList.remove('frightened'))
          squares.forEach(square => square.classList.remove('ghost-flash'))
        }
      }
    }
    checkGhostCapture() {
      if (this.frightenedStatus === 'Y') {
        if (pacMan.currentIndex === this.currentIndex || ((pacMan.currentIndex === this.previousIndex) && (pacMan.previousIndex === this.currentIndex))) {

          playSound(audioLinks['eatGhost'])

          this.captureStatus = 'Y'
          const ghostCaptureScore = (200 * (Math.pow(2, ghostsInPenArray.length))) // score for capturing first ghost in capture mode is 200, next ghost is 400, next is 800, final one would be 1600
          score += ghostCaptureScore
          ghostsInPenArray.push(this.name) // moves ghosts in to the pen
          squares[this.currentIndex].classList.remove('ghost')
          squares[this.previousIndex].classList.remove('frightened')
          squares[this.currentIndex].classList.remove('frightened')

          this.captureIndex = this.previousIndex
          
          switch (ghostCaptureScore) { // flashes up with the capture score for each ghost you capture
            case 200:
              squares[this.captureIndex].classList.add('capture-score1')
              break
            case 400:
              squares[this.captureIndex].classList.add('capture-score2')
              break
            case 800:
              squares[this.captureIndex].classList.add('capture-score3')
              break
            case 1600:
              squares[this.captureIndex].classList.add('capture-score4')
              break
          }          
          removeCaptureScoreTimeout() // capture score flashes up for 800ms, then disappears
        }
      }
    }
    keepGhostInPen () {
      if (this.captureStatus === 'Y') {
        this.currentIndex = this.penPosition
        squares.forEach(square => square.classList.remove(this.name))
        squares[this.previousIndex].classList.remove('ghost')
        squares[this.currentIndex].classList.add(this.name)
        squares[this.currentIndex].classList.add('ghost')
        squares[this.currentIndex].classList.add('frightened')
        this.captureTime++
        if (this.captureTime > 1000 * ((13 - level) / 12)) {  // capture time finishing
          this.captureStatus = 'N'
          this.captureTime = 0
          // squares[this.currentIndex].classList.add('frightened') // question
          // squares[this.previousIndex].classList.add('frightened') // question
        }
      }
    }
  }

  class Player extends Characters {
    constructor(name, startingIndex, startingDirection, previousIndex, currentIndex, currentDirection, proposedDirection) {
      super(name, startingIndex, startingDirection, previousIndex, currentIndex, currentDirection)
      this.proposedDirection = proposedDirection // direction pressed by user prior to PacMan's next move
      this.previousDirection = null
      // target positions for ghosts to chase in chase mode
      this.targetRowPink = null
      this.targetColumnPink = null
      this.targetRowBlue = null
      this.targetColumnBlue = null
      this.pacManChomping = null
    }
    pacManAnimation () {
      if (this.currentIndex === this.previousIndex) { // remove moving and chomping animation when PacMan is stationary
        squares[this.currentIndex].classList.remove('moving')
        squares[this.currentIndex].classList.remove('left')
        squares[this.currentIndex].classList.remove('up')
        squares[this.currentIndex].classList.remove('right')
        squares[this.currentIndex].classList.remove('down')
        squares[this.currentIndex].classList.add('stationary')
        this.currentDirection = this.previousDirection // ensures PacMan remains facing the direction he was in before stopping
        document.documentElement.style.setProperty('--rotation', playerDirectionObject[this.currentDirection]) // set the PacMan's rotation in CSS
      } else {
        squares.forEach(square => square.classList.remove('stationary'))
        squares[this.previousIndex].classList.remove('moving')
        squares[this.currentIndex].classList.add('moving')
      }
    }
    automaticMovement () {
      this.previousDirection = this.currentDirection
      
      switch (this.currentIndex) { // ensures PacMan passes through the tunnels on both sides
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
      const proposedPos = this.currentIndex + this.proposedDirection // proposedDirection is the last direction key pressed
      const predictedPos = this.currentIndex + this.currentDirection
      
      // if user hits direction button, check if PacMan can go that way, if he can then let him change direction, if not allow him to automatically continue to move in his current direction, unless there is a wall where he should just stop
      if (openSquares.includes(wallsArray[proposedPos])) {
        this.currentDirection = this.proposedDirection
      } else if (openSquares.includes(wallsArray[predictedPos])) {
        this.currentDirection = this.currentDirection
      } else {
        this.currentDirection = 0
      }

      this.currentIndex += this.currentDirection // update current position

      this.storeCurrentCoordinates(this.currentIndex)
      this.pinkTargetCoordinates(this.currentIndex, this.currentDirection, 4)
      this.blueTargetCoordinates(this.currentIndex, this.currentDirection, 2)

      this.previousIndex = this.currentIndex - this.currentDirection

      if (squares[this.currentIndex].classList.contains('food')) {
        squares[this.currentIndex].classList.remove('food')
        score += 10
        this.chomping = 'Y' // for chomping audio
        if (score > highScore) {
          highScore = score
        }
        highScoreDisplay.innerHTML = highScore
      } else if (squares[this.currentIndex].classList.contains('energizer')) {
        score += 50
        this.chomping = 'Y'
        if (score > highScore) {
          highScore = score
        }
        highScoreDisplay.innerHTML = highScore
      } else if (!squares[this.currentIndex].classList.contains('food') && !squares[this.currentIndex].classList.contains('energizer')) {
        this.chomping = 'N'
      }
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.currentIndex].classList.add(this.name)

      this.characterAnimation()
      this.pacManAnimation()
      
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

    pinkTargetCoordinates (position, direction, tilesAhead) {
      const targetPosition = position + (tilesAhead * direction)
      this.targetRowPink = Math.ceil((targetPosition + 1) / width)
      this.targetColumnPink = ((targetPosition + 1) % width) === 0 ? width : ((targetPosition + 1) % width)
    }
    blueTargetCoordinates (position, direction, tilesAhead) {
      const targetPosition = position + (tilesAhead * direction)
      this.targetRowBlue = Math.ceil((targetPosition + 1) / width)
      this.targetColumnBlue = ((targetPosition + 1) % width) === 0 ? width : ((targetPosition + 1) % width)
    }
    orangeTargetCoordinates (position, direction, tilesAhead) {
      const targetPosition = position + (tilesAhead * direction)
      this.targetRowBlue = Math.ceil((targetPosition + 1) / width)
      this.targetColumnBlue = ((targetPosition + 1) % width) === 0 ? width : ((targetPosition + 1) % width)
    }
  }
  
  const pacMan = new Player('pacman', 658, -1, 659, 658, -1, -1, 0)
  squares[pacMan.currentIndex].classList.add('pacman')
  squares[pacMan.currentIndex].classList.add('stationary') // put pacman in starting position
  squares[pacMan.currentIndex].classList.add('adjusted') // move PacMan to absolute centre of the grid
  
  const redGhost = new Characters('red', 322, 1, 321, 322, 1, 405, 24)
  squares[redGhost.currentIndex].classList.add('ghost')
  squares[redGhost.currentIndex].classList.add('red')
  squares[redGhost.currentIndex].classList.add('adjusted') // move ghost to absolute centre of the grid

  const blueGhost = new Characters('blue', 404, 1, 403, 404, 1, 404, 866)
  squares[blueGhost.currentIndex].classList.add('ghost')
  squares[blueGhost.currentIndex].classList.add('blue')

  const orangeGhost = new Characters('orange', 406, -28, 433, 406, -28, 406, 841)
  squares[orangeGhost.currentIndex].classList.add('ghost')
  squares[orangeGhost.currentIndex].classList.add('orange')
  squares[orangeGhost.currentIndex].classList.add('adjusted') // move ghost to absolute centre of the grid

  const pinkGhost = new Characters('pink', 407, -1, 408, 407, -1, 407, 3)
  squares[pinkGhost.currentIndex].classList.add('ghost')
  squares[pinkGhost.currentIndex].classList.add('pink')

  const ghostArray = [redGhost, blueGhost, orangeGhost, pinkGhost]

  // CHARACTER MOVEMENT FUNCTIONS

  function playerMove () {
    pacMan.automaticMovement()
    window.addEventListener('keydown', pacMan.handleKeyDown)
  }

  function ghostMovement () {
    const chaseDuration = 18 + (level * 2) // time spent in chase mode increases with each level
    const scatterDuration = Math.max(8 - level, 0) // time spent scatter mode decreases with each level down to 0s
    if ((ghostArray.filter(eachGhost => eachGhost.frightenedStatus === 'Y')).length === 0) {
      ghostTime += (ghostSpeed / 1000) // if no ghosts are in frightened mode
      if (((ghostTime * (1000 / ghostSpeed)) % (chaseDuration * (1000 / ghostSpeed))) < (scatterDuration * (1000 / ghostSpeed))) {  // toggle ghosts between scatter mode and chase mode based on game time and scatter duration
        for (const eachGhost of ghostArray) {
          eachGhost.scatterStatus = 'Y'
          eachGhost.chaseStatus = 'N'
          eachGhost.scatter()
        }
      } else {
        for (const eachGhost of ghostArray) {
          eachGhost.scatterStatus = 'N'
          eachGhost.chaseStatus = 'Y'
          eachGhost.chase()
        }
      }
    }
  }

  // ONGOING CHECKING FUNCTIONS

  function checkDeath () {
    for (const eachGhost of ghostArray) {
      if ((eachGhost.chaseStatus === 'Y' || eachGhost.scatterStatus === 'Y') && ((pacMan.currentIndex === eachGhost.currentIndex) || ((pacMan.currentIndex === eachGhost.previousIndex) && (pacMan.previousIndex === eachGhost.currentIndex)))) { // if ghost isn't in frightened mode and shares the same position as PacMan

        playSound(audioLinks['death'])
        pauseSirenSound()
        pauseChompSound()
        
        for (const eachGhost of ghostArray) { // remove ghost from position it ate PacMan
          squares[eachGhost.currentIndex].classList.remove('left')
          squares[eachGhost.currentIndex].classList.remove('right')
          squares[eachGhost.currentIndex].classList.remove('down')
          squares[eachGhost.currentIndex].classList.remove('up')
          if (pacMan.currentIndex === pacMan.previousIndex) {
            squares[eachGhost.previousIndex].classList.add('ghost')
            squares[eachGhost.previousIndex].classList.add(eachGhost.name)
            squares[eachGhost.currentIndex].classList.remove('ghost')
            squares[eachGhost.currentIndex].classList.remove(eachGhost.name)
          } else {
            squares[eachGhost.previousIndex].classList.remove('ghost')
            squares[eachGhost.previousIndex].classList.remove(eachGhost.name)
            squares[eachGhost.currentIndex].classList.add('ghost')
            squares[eachGhost.currentIndex].classList.add(eachGhost.name)
          }
        }
        squares.forEach(square => square.classList.remove('pacman'))
        squares.forEach(square => square.classList.remove('moving'))
        this.currentDirection = this.previousDirection
        document.documentElement.style.setProperty('--rotation', playerDirectionObject[pacMan.currentDirection]) // reset CSS rotation for PacMan
        squares[pacMan.previousIndex].classList.add('pacman')
        squares[pacMan.previousIndex].classList.add('stationary')
        squares[pacMan.previousIndex].classList.add('death') // play CSS death animation

        window.removeEventListener('keydown', pacMan.handleKeyDown)

        // clear all in-play timers
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
        
        livesDisplayArray.pop()
        updateLives()
        countDownTime = 3
        ghostTime = 0
        for (let i = 0; i < width * height; i++) {
          if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
            squares[i].classList.remove('flash')
          }
        }

        setTimeout(() => {
          squares.forEach(square => square.classList.remove('pacman'))
          squares.forEach(square => square.classList.remove('stationary'))
          squares.forEach(square => square.classList.remove('death'))
        }, 900) // remove PacMan from position of death after 900ms, to allow animation

        setTimeout(() => {
          squares.forEach(square => square.classList.remove('red'))
          squares.forEach(square => square.classList.remove('blue'))
          squares.forEach(square => square.classList.remove('orange'))
          squares.forEach(square => square.classList.remove('pink'))
          squares.forEach(square => square.classList.remove('ghost'))
          squares.forEach(square => square.classList.remove('frightened'))
          squares.forEach(square => square.classList.remove('ghost-flash'))
          pacMan.currentIndex = pacMan.startingIndex
          pacMan.currentDirection = pacMan.startingDirection
          pacMan.proposedDirection = pacMan.startingDirection
          for (const eachGhost of ghostArray) {
            eachGhost.currentIndex = eachGhost.startingIndex
            eachGhost.currentDirection = eachGhost.startingDirection
            eachGhost.scatterStatus = 'Y'
            eachGhost.chaseStatus = 'N'
            eachGhost.frightenedStatus = 'N'
            eachGhost.frightenedTime = 0
            eachGhost.captureStatus = 'N'
            eachGhost.captureTime = 0
          }
          document.documentElement.style.setProperty('--rotation', playerDirectionObject[pacMan.currentDirection])
          squares[pacMan.currentIndex].classList.add('pacman')
          squares[pacMan.currentIndex].classList.add('stationary')
          squares[redGhost.currentIndex].classList.add('red')
          squares[redGhost.currentIndex].classList.add('ghost')
          squares[blueGhost.currentIndex].classList.add('blue')
          squares[blueGhost.currentIndex].classList.add('ghost')
          squares[orangeGhost.currentIndex].classList.add('orange')
          squares[orangeGhost.currentIndex].classList.add('ghost')
          squares[pinkGhost.currentIndex].classList.add('pink')
          squares[pinkGhost.currentIndex].classList.add('ghost')
          squares[pacMan.currentIndex].classList.add('adjusted')
          squares[redGhost.currentIndex].classList.add('adjusted')
          squares[orangeGhost.currentIndex].classList.add('adjusted')
          lives--

          if (lives >= 0) {
            startTimer()
          } else {
            restartMessage.classList.remove('hidden')
            restartMessage.innerHTML = 'hit space to restart'
            restartMessage.classList.add('flash')
            countdownDisplay.classList.remove('hidden')
            countdownDisplay.innerHTML = 'GAME OVER'
            countdownDisplay.classList.add('game-over')
            for (let i = 0; i < width * height; i++) {
              if (wallsArray[i] === 'F' || wallsArray[i] === 'X') {
                squares[i].classList.add('food')
              } else if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
                squares[i].classList.add('energizer')
              }
            }
            livesDisplayArray = [1, 1]
            level = 1
            score = 0
            lives = 2
            window.addEventListener('keydown', spaceDown)
          }

        }, 2000)

      }
    }
  }

  function checkLevelUp () {
    const foodLeft = squares.filter(square => square.classList.contains('food') || square.classList.contains('energizer'))
    if (foodLeft.length === 0) {

      pauseSirenSound()
      pauseChompSound()

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

      squares.forEach(square => square.classList.remove('moving'))
      pacMan.currentDirection = pacMan.previousDirection
      document.documentElement.style.setProperty('--rotation', playerDirectionObject[pacMan.currentDirection])
      squares[pacMan.currentIndex].classList.add('stationary')
      document.querySelector('div.grid-item.pacman.stationary').style.transform = 'scale(1.5, 1.5)'
      for (const eachGhost of ghostArray) {
        squares[eachGhost.currentIndex].classList.remove('left')
        squares[eachGhost.currentIndex].classList.remove('up')
        squares[eachGhost.currentIndex].classList.remove('right')
        squares[eachGhost.currentIndex].classList.remove('down')
      }
      ghostTime = 0
      level++

      for (let i = 0; i < width * height; i++) {
        if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
          squares[i].classList.remove('flash')
        }
      }

      setTimeout(() => {
        squares.forEach(square => square.classList.remove('pacman'))
        squares.forEach(square => square.classList.remove('red'))
        squares.forEach(square => square.classList.remove('blue'))
        squares.forEach(square => square.classList.remove('orange'))
        squares.forEach(square => square.classList.remove('pink'))
        squares.forEach(square => square.classList.remove('ghost'))
        pacMan.currentIndex = pacMan.startingIndex
        pacMan.currentDirection = pacMan.startingDirection
        pacMan.proposedDirection = pacMan.startingDirection
        for (const eachGhost of ghostArray) {
          eachGhost.currentIndex = eachGhost.startingIndex
          eachGhost.currentDirection = eachGhost.startingDirection
          eachGhost.scatterStatus = 'Y'
          eachGhost.chaseStatus = 'N'
          eachGhost.frightenedStatus = 'N'
          eachGhost.frightenedTime = 0
          eachGhost.captureStatus = 'N'
          eachGhost.captureTime = 0
        }
        document.documentElement.style.setProperty('--rotation', playerDirectionObject[pacMan.currentDirection])
        squares[pacMan.currentIndex].classList.add('pacman')
        squares[pacMan.currentIndex].classList.add('stationary')
        squares[redGhost.currentIndex].classList.add('red')
        squares[redGhost.currentIndex].classList.add('ghost')
        squares[blueGhost.currentIndex].classList.add('blue')
        squares[blueGhost.currentIndex].classList.add('ghost')
        squares[orangeGhost.currentIndex].classList.add('orange')
        squares[orangeGhost.currentIndex].classList.add('ghost')
        squares[pinkGhost.currentIndex].classList.add('pink')
        squares[pinkGhost.currentIndex].classList.add('ghost')
        squares[pacMan.currentIndex].classList.add('adjusted')
        squares[redGhost.currentIndex].classList.add('adjusted')
        squares[orangeGhost.currentIndex].classList.add('adjusted')
        countDownTime = 3
        levelDisplay.innerHTML = level
        for (let i = 0; i < width * height; i++) {
          if (wallsArray[i] === 'F' || wallsArray[i] === 'X') {
            squares[i].classList.add('food')
          } else if (wallsArray[i] === 'E' || wallsArray[i] === 'Y') {
            squares[i].classList.add('energizer')
          }
        }
        startTimer()  
      }, playerSpeed * 2)

    }
  }

  function checkEnergizer () {
    if (squares[pacMan.currentIndex].classList.contains('energizer')) {

      playSound(audioLinks['eatEnergizer'])

      squares[pacMan.currentIndex].classList.remove('energizer')
      squares[pacMan.currentIndex].classList.remove('flash')
      
      for (const eachGhost of ghostArray) {
        if (eachGhost.frightenedTime === 0) {
          eachGhost.frightenedStatus = 'Y'
        } else if ((eachGhost.frightenedTime > 0) && (eachGhost.frightenedTime <= (2 * (14 - level))) && (eachGhost.captureStatus === 'N')) { // reset frightenedTime for ghosts that are already in frightened mode but not captured. If the ghost is currently captured, it does not become frightened again.
          eachGhost.frightenedTime = 0
        }
      }
    }
  }

  function checkGhostsFrightenedAll () {
    ghostArray.forEach(ghost => ghost.frightened())
  }

  function checkGhostCaptureAll () {
    ghostArray.forEach(ghost => ghost.checkGhostCapture())
  }

  function keepGhostInPenAll () {
    ghostArray.forEach(ghost => ghost.keepGhostInPen())
  }

  function checkPenStyle () {
    for (const eachGhost of ghostArray) {
      if (eachGhost.captureStatus === 'N') {
        squares[eachGhost.penPosition].classList.remove('frightened')
      }
    }
  }

  function controlGhostsInPenArray () { // remove ghost from ghostsInPenArray when it's capture status returns to 'N'
    for (const eachGhost of ghostArray) {
      if (ghostsInPenArray.includes(eachGhost.name) && eachGhost.captureStatus === 'N') {
        ghostsInPenArray.splice(ghostsInPenArray.indexOf(eachGhost.name), 1)
      }
    }
  }

  function removeCaptureScore () {
    squares.forEach(square => square.classList.remove('capture-score1'))
    squares.forEach(square => square.classList.remove('capture-score2'))
    squares.forEach(square => square.classList.remove('capture-score3'))
    squares.forEach(square => square.classList.remove('capture-score4'))
  }

  // SOUND FUNCTIONS

  function checkPacManChomp () {
    if (pacMan.chomping === 'Y') {
      playChompSound()
    } else {
      pauseChompSound()
    }
  }

  function playSirenSound() {
    sirenAudio.src = 'http://soundfxcenter.com/video-games/pacman/8d82b5_Pacman_Siren_Sound_Effect.mp3'
    sirenAudio.play()
  }

  function pauseSirenSound() {
    sirenAudio.src = 'http://soundfxcenter.com/video-games/pacman/8d82b5_Pacman_Siren_Sound_Effect.mp3'
    sirenAudio.pause()
  }

  function playSound(audioLink) {
    audio.src = audioLink
    audio.play()
  }

  function playChompSound() {
    chompAudio.src = 'https://vgmdownloads.com/soundtracks/pac-man-game-sound-effects/knwtmadt/Chomp.mp3'
    chompAudio.play()
  }

  function pauseChompSound() {
    chompAudio.src = 'https://vgmdownloads.com/soundtracks/pac-man-game-sound-effects/knwtmadt/Chomp.mp3'
    chompAudio.pause()
  }

  // TIMERS

  function startTimer () {
    playSound(audioLinks['intro'])
    timerId1 = setInterval(countDownTimer, 1000)
  }

  function countDownTimer () {
    updateSpeeds(1)
    countdownDisplay.classList.remove('flash')
    countdownDisplay.classList.remove('hidden')
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
      // timers for player and ghost movement on each execution of the callback function
      playerMoveTimer()
      ghostMovementTimer()
      playSirenSound()
      squares[pacMan.currentIndex].classList.remove('adjusted')
      squares[orangeGhost.currentIndex].classList.remove('adjusted')
      squares[redGhost.currentIndex].classList.remove('adjusted')
      // timers below run every 0s to constantly check for events
      checkDeathTimer()
      checkLevelUpTimer()
      checkEnergizerTimer()
      checkGhostFrightenedTimer()
      checkGhostCaptureTimer()
      penTimer()
      checkPenStyleTimer()
      controlGhostsInPenArrayTimer()
      checkPacManChompTimer()
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

  function playerMoveTimer () {
    timerId2 = setInterval(playerMove, playerSpeed)
  }

  function ghostMovementTimer () {
    timerId3 = setInterval(ghostMovement, ghostSpeed)
  }

  function checkDeathTimer () {
    timerId4 = setInterval(checkDeath)
  }
  
  function checkLevelUpTimer () {
    timerId5 = setInterval(checkLevelUp)
  }

  function checkEnergizerTimer () {
    timerId6 = setInterval(checkEnergizer)
  }

  function checkGhostFrightenedTimer () { // this function cannot run every 0s like the others because the frightened time is increased with each execution
    timerId7 = setInterval(checkGhostsFrightenedAll, ghostSpeed * 2)
  }

  function checkGhostCaptureTimer () {
    timerId8 = setInterval(checkGhostCaptureAll)
  }

  function penTimer () { // this function cannot run every 0s like the others because the capture time is increased with each execution
    timerId9 = setInterval(keepGhostInPenAll, 1)
  }

  function checkPenStyleTimer () {
    timerId10 = setInterval(checkPenStyle)
  }

  function controlGhostsInPenArrayTimer () {
    timerId11 = setInterval(controlGhostsInPenArray)
  }

  function checkPacManChompTimer () { // checks if PacMan is chomping and plays chomp sound if he is
    timerId12 = setInterval(checkPacManChomp, 700)
  }

  function removeCaptureScoreTimeout () {
    timerId13 = setTimeout(removeCaptureScore, 800)
  }

  // EVENT HANDLERS

  window.addEventListener('keydown', spaceDown) // spaceDown listener is only active at the start of a game or after restarting

  function spaceDown (e) {
    if (e.keyCode === 32) {
      updateLives()
      startTimer()
      levelDisplay.innerHTML = level
      currentScoreDisplay.innerHTML = '00'
      restartMessage.classList.remove('flash')
      restartMessage.classList.add('hidden')
      countdownDisplay.classList.remove('game-over')
      countdownDisplay.classList.add('hidden')
    }
  }

}

window.addEventListener('DOMContentLoaded', init)