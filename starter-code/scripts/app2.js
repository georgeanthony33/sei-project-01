function init() {

  //  dom variables
  const grid = document.querySelector('.grid')
  const startBtn = document.querySelector('.start')
  const countdown = document.querySelector('.countdown')

  // game variables
  const squares = []
  const width = 28
  const height = 31
  let playerIndex = 658
  const directionArray = [-28, 1, 28, -1, 27, -27]
  let score = 0
  let lives = 2
  let timerId1 = null
  let timerId2 = null
  let timerId3 = null
  let countDownTime = 3
  let gameTime = 0
  let gameSpeed = 200

  // loop as many times as width times the height to fill the grid
  Array(width * height).join('.').split('.').forEach(() => {
    // create 
    const square = document.createElement('div')
    square.classList.add('grid-item')
    squares.push(square)
    grid.appendChild(square)
  })

  // create wall array
  const walls = [
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
    if (walls[i] === 1) {
      squares[i].classList.add('wall')
    }
  }

  // loop through walls array to place food
  for (let i = 0; i < width * height; i++) {
    if (walls[i] === 0) {
      squares[i].classList.add('food')
    }
  }

  // places player at the starting position when grid has finished building, stops player from crossing walls and adds to score if player eats food
  squares[playerIndex].classList.add('player')
  function handleKeyDown(e) {
    switch (e.keyCode) {
      case 39:
        if (playerIndex === 419) {
          squares[playerIndex].classList.remove('food')
          if (squares[392].classList.contains('food')) {
            score += 10
          }
          playerIndex = 392
        } else if (!(squares[playerIndex + 1].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex + 1].classList.contains('food')) {
            score += 10
          }
          playerIndex++
        }
        break
      case 37:
        if (playerIndex === 392) {
          squares[playerIndex].classList.remove('food')
          if (squares[419].classList.contains('food')) {
            score += 10
          }
          playerIndex = 419
        } else if (!(squares[playerIndex - 1].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex - 1].classList.contains('food')) {
            score += 10
          }
          playerIndex--
        }
        break
      case 40:
        if (!(squares[playerIndex + width].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex + width].classList.contains('food')) {
            score += 10
          }
          playerIndex += width
        }
        break
      case 38:
        if (!(squares[playerIndex - width].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex - width].classList.contains('food')) {
            score += 10
          }
          playerIndex -= width
        } 
        break
      default:
    }
    console.log(score)
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
  }

  // places red ghost at starting position

  class Ghosts {
    constructor(name, index, direction) {
      this.name = name,
      this.index = index,
      this.direction = direction,
      this.directionArray = [1, -1, 28, -28, 27, -27],
      this.whereToGo = []
    }
    ghostMoves () {
      const nextAlong = this.index + this.direction
      this.directionArray = [1, -1, 28, -28, 27, -27]
      this.whereToGo = []
      if (walls[nextAlong] === 0) {
        this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== ((-1) * (this.direction)))
        if (this.index === 392) {
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== 1)
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== -1)
        } else if (this.index === 419) {
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== 1)
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== -1)
        } else {
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== 27)
          this.directionArray = this.directionArray.filter(eachDirection => eachDirection !== -27)
        }
        for (const eachDirection of this.directionArray) {
          const potentialPos = this.index + eachDirection
          if (walls[potentialPos] === 0) {
            this.whereToGo.push(eachDirection)
          }
        }
      } else {
        this.directionArray.pop()
        this.directionArray.pop()
        for (const eachDirection of this.directionArray) {
          const potentialPos = this.index + eachDirection
          if (walls[potentialPos] === 0) {
            this.whereToGo.push(eachDirection)
          }
        }
      }
      const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
      // squares.forEach(square => square.classList.remove(`${this.Direction}`))
      this.direction = parseFloat(this.whereToGo[randomNumber])
      // squares.forEach(square => square.classList.add(`${this.Direction}`))
      this.index = parseFloat(parseFloat(this.index) + parseFloat(this.direction))
      if (this.index === 392) {
        if (this.direction === -1) {
          this.direction = 27
        }
      } else if (this.index === 419) {
        if (this.direction === 1) {
          this.direction = -27
        }
      }
      squares.forEach(square => square.classList.remove(this.name))
      squares[this.index].classList.add(this.name)
    }
  }

  const redIndex = 322
  squares[redIndex].classList.add('red')
  const redGhost = new Ghosts('red', 322, 1)

  // const blueIndex = 405
  // squares[blueIndex].classList.add('blue')
  // const blueGhost = new Ghosts('blue', 405, -28)

  function checkDeath () {
    if (playerIndex === redGhost.index
      //  || playerIndex === blueGhost.index
      ) {
      clearInterval(timerId2)
      playerIndex = 658
      squares.forEach(square => square.classList.remove('player'))
      squares[playerIndex].classList.add('player')
      redGhost.index = 322
      // blueGhost.index = 405
      squares.forEach(square => square.classList.remove('red'))
      // squares.forEach(square => square.classList.remove('blue'))
      squares[redGhost.index].classList.add('red')
      // squares[blueGhost.index].classList.add('blue')
      window.removeEventListener('keydown', handleKeyDown)
      lives--
      console.log(lives)
      clearInterval(timerId3)
      countDownTime = 3
      gameTime = 0
      startTimers()
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
      redGhost.ghostMoves()
      // blueGhost.ghostMoves()
      window.addEventListener('keydown', handleKeyDown)
      gameTime++
    }
  }

  function startTimers () {
    timerId1 = setInterval(countDownTimer, 1000)
    timerId2 = setInterval(gameTimer, gameSpeed)
    timerId3 = setInterval(checkDeath, 1)
  }

  // event handlers
  startBtn.addEventListener('click', startTimers)
}

window.addEventListener('DOMContentLoaded', init)