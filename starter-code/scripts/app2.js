function init() {

  //  DOM VARIABLES
  const grid = document.querySelector('.grid') // grab grid div
  const startBtn = document.querySelector('button.start') // grab start button
  const countdown = document.querySelector('h2.countdown') // grab countdown display
  const scoreDisplay = document.querySelector('h2#current-score')
  const livesDisplay = document.querySelector('h2#lives-left')

  // GAME VARIABLES
  const squares = [] // squares within grid
  const width = 28 // number of squares across
  const height = 31 // number of squares down
  // const directionArray = [-28, 1, 28, -1, 27, -27] (suspect I don't need this)
  let level = 1
  let score = 0 // initial score
  let lives = 2 // initial lives -> die if lives < 0
  let timerId1 = null
  let timerId2 = null
  let timerId3 = null
  let timerId4 = null
  let countDownTime = 1 // countdown starts from 3 before game starts
  let gameTime = 0 // gameTime begins after countdown and starts from 0
  let gameSpeed = 250 // speed of ghost

  // loop as many times as width times the height to fill the grid
  Array(width * height).join('.').split('.').forEach(() => { // create array with (width * height) empty elements ''
    const square = document.createElement('div') // create a square for each element
    square.classList.add('grid-item') // add grid-item class to each square
    squares.push(square) // push square to squares array
    grid.appendChild(square) // append square to the grid div
  })

  // create wall array: 1 = wall, 0 = food
  const wallsArray = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 4, 4, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 4, 4, 3, 3, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 4, 4, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 4, 4, 3, 3, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

  // loop through walls array to build walls
  for (let i = 0; i < width * height; i++) {
    if (wallsArray[i] === 1) {
      squares[i].classList.add('wall')
    }
  }

  // loop through walls array to place food
  for (let i = 0; i < width * height; i++) {
    if (wallsArray[i] === 0) {
      squares[i].classList.add('food')
    }
  }

  // create Ghost class with properties and movement method
  class Ghosts {
    constructor(name, index, direction) {
      this.name = name, // colour of ghost
      this.index = index, // current position
      this.direction = direction, // current direction
      this.directionArray = [1, -1, 28, -28, 27, -27], // array of possible directions, to be filtered down
      this.whereToGo = [] // empty array to be filled with available directions
    }
    ghostMovementRules () {
      // before anything happens, adjust the direction of ghost if it is about to pass through the hole in the wall, so that it is directed for the other side, as opposed to otherwise having a direction of +1 or -1
      if (wallsArray[this.index] === 2) {
        this.index++
        this.direction = 1
      } else if (wallsArray[this.index] === 3) {
        this.index--
        this.direction = -1
      } else if (wallsArray[this.index] === 4) {
        this.index -= 28
        this.direction = -28
      } else {
        if (this.index === 392) {
          if (this.direction === -1) {
            this.direction = 27
          }
        } else if (this.index === 419) {
          if (this.direction === 1) {
            this.direction = -27
          }
        }
        // nextAlong is the next position the ghost would be in if it follows same direction
        const nextAlong = this.index + this.direction
        this.directionArray = [1, -1, 28, -28, 27, -27]
        this.whereToGo = []
        if (wallsArray[nextAlong] === 0) { // if no wall in same direction ghost is already going
          // remove opposite direction from options
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== ((-1) * (this.direction)))
          if (this.index === 392 && this.direction === 27) { // if at hole in wall, ghost has to skip to either side
            this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== 1)
          } else if (this.index === 419 && this.direction === -27) { // if at hole in wall, ghost has to skip to either side
            this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== -1)
          } else { // if not at hole in wall, remove option to skip to other side of grid
            this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== 27)
            this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== -27)
          }
          for (const eachDirection of this.directionArray) { // loop through all options left of where ghost can go
            const potentialPos = this.index + eachDirection
            if (wallsArray[potentialPos] === 0) {
              this.whereToGo.push(eachDirection) // push all directions left where there won't be a wall
            }
          }
        } else {
          this.directionArray.pop() // remove 27 and -27 from directionArray
          this.directionArray.pop()
          for (const eachDirection of this.directionArray) { // loop through all options left of where ghost can go
            const potentialPos = this.index + eachDirection
            if (wallsArray[potentialPos] === 0) {
              this.whereToGo.push(eachDirection) // push all directions left where there won't be a wall
            }
          }
        }
        // create n random numbers where n = number of directions available to ghost
        const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
  
        // squares.forEach(square => square.classList.remove(`${this.Direction}`))
        this.direction = this.whereToGo[randomNumber] // choose direction from array based off random number
        // squares.forEach(square => square.classList.add(`${this.Direction}`))
        
        // update next ghost position by adding direction to current position
        this.index = this.index + this.direction
      }
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.index].classList.add(this.name) // move ghost along to updated position
    }
    chaseAggresive () {
      this.ghostMovementRules()
    }
    playerMove(e) { // function triggers on any key being pushed, stops player from crossing walls and adds to score if player eats food
      switch (e.keyCode) {
        case 39: // right arrow
          if (pacMan.index === 419) {
            squares[pacMan.index].classList.remove('food')
            if (squares[392].classList.contains('food')) {
              score += 10
            }
            pacMan.index = 392
            pacMan.direction = 1
          } else if (!(squares[pacMan.index + 1].classList.contains('wall'))) { // check if next square is wall
            squares[pacMan.index].classList.remove('food')
            if (squares[pacMan.index + 1].classList.contains('food')) {
              score += 10 // check if next square has food - if so, add 10 to score
            }
            pacMan.index++
            pacMan.direction = 1
          }
          break
        case 37: // left arrow
          if (pacMan.index === 392) {
            squares[pacMan.index].classList.remove('food')
            if (squares[419].classList.contains('food')) {
              score += 10
            }
            pacMan.index = 419
            pacMan.direction = -1
          } else if (!(squares[pacMan.index - 1].classList.contains('wall'))) {
            squares[pacMan.index].classList.remove('food')
            if (squares[pacMan.index - 1].classList.contains('food')) {
              score += 10
            }
            pacMan.index--
            pacMan.direction = -1
          }
          break
        case 40: // down arrow
          if (!(squares[pacMan.index + width].classList.contains('wall'))) {
            squares[pacMan.index].classList.remove('food')
            if (squares[pacMan.index + width].classList.contains('food')) {
              score += 10
            }
            pacMan.index += width
            pacMan.direction = width
          }
          break
        case 38: // up arrow
          if (!(squares[pacMan.index - width].classList.contains('wall'))) {
            squares[pacMan.index].classList.remove('food')
            if (squares[pacMan.index - width].classList.contains('food')) {
              score += 10
            }
            pacMan.index -= width
            pacMan.direction = -width
          } 
      }
      scoreDisplay.innerHTML = score
      squares.forEach(square => square.classList.remove('player'))
      squares[pacMan.index].classList.add('player') // move pacman along to updated position
    }
  }

  const pacMan = new Ghosts('pacman', 658, -1)
  squares[pacMan.index].classList.add('player') // put pacman in starting position

  const redGhost = new Ghosts('red', 322, 1)
  squares[redGhost.index].classList.add('red')

  const blueGhost = new Ghosts('blue', 404, 1)
  squares[blueGhost.index].classList.add('blue')

  function checkDeath () {
    if (pacMan.index === redGhost.index || pacMan.index === blueGhost.index) {
      clearInterval(timerId2)
      clearInterval(timerId3)
      clearInterval(timerId4)
      window.removeEventListener('keydown', pacMan.playerMove)
      squares.forEach(square => square.classList.remove('player'))
      squares.forEach(square => square.classList.remove('red'))
      squares.forEach(square => square.classList.remove('blue'))
      pacMan.index = 658
      redGhost.index = 322
      blueGhost.index = 405
      squares[pacMan.index].classList.add('player')
      squares[redGhost.index].classList.add('red')
      squares[blueGhost.index].classList.add('blue')
      lives--
      if (lives >= 0) {
        countDownTime = 3
        gameTime = 0
        livesDisplay.innerHTML = lives
        startTimers()
      } else {
        livesDisplay.innerHTML = 0
        alert('GAME OVER')
      }
    }
  }

  function checkLevelUp () {
    const foodLeft = squares.filter(square => square.classList.contains('food'))
    if (foodLeft.length === 0) {
      clearInterval(timerId2)
      window.removeEventListener('keydown', pacMan.playerMove)
      squares.forEach(square => square.classList.remove('player'))
      squares.forEach(square => square.classList.remove('red'))
      squares.forEach(square => square.classList.remove('blue'))
      pacMan.index = 658
      redGhost.index = 322
      blueGhost.index = 405
      squares[pacMan.index].classList.add('player')
      squares[redGhost.index].classList.add('red')
      squares[blueGhost.index].classList.add('blue')
      clearInterval(timerId3)
      clearInterval(timerId4)
      countDownTime = 3
      gameTime = 0
      gameSpeed -= 25
      for (let i = 0; i < width * height; i++) {
        if (wallsArray[i] === 0) {
          squares[i].classList.add('food')
        }
      }
      startTimers()
      console.log(gameSpeed)
    }
  }

  function countDownTimer () {
    if (countDownTime >= 1) {
      countdown.innerHTML = countDownTime
      countDownTime--
    } else if (countDownTime === 0) {
      countdown.innerHTML = 'GO!'
      countDownTime--
    } else {
      clearInterval(timerId1)
    }
  }

  function gameTimer () {
    if (countDownTime < 0) {
      redGhost.chaseAggresive()
      blueGhost.chaseAggresive()
      // pacMan.automaticMovement()
      window.addEventListener('keydown', pacMan.playerMove)
      gameTime++
    }
  }

  function startTimers () {
    timerId1 = setInterval(countDownTimer, 1000)
    timerId2 = setInterval(gameTimer, gameSpeed)
    timerId3 = setInterval(checkDeath, 0)
    timerId4 = setInterval(checkLevelUp, 0)
  }

  // event handlers
  startBtn.addEventListener('click', startTimers)
}

window.addEventListener('DOMContentLoaded', init)