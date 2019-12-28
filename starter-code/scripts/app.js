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
  let yellowIndex = 407
  let directionArray = [-28, 1, 28, -1, 27, -27]
  let score = 0
  let lives = 2
  let timerId1 = null
  let timerId2 = null
  let timerId3 = null
  let countDownTime = 0
  let gameTime = 0
  let gameSpeed = 300

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
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
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

  // squares[turqoiseIndex].classList.add('turqoise')
  // let turqoiseDirection = directionArray [0]
  // function turqoiseGhostMoves ()

  squares[redIndex].classList.add('red')
  squares[redIndex].classList.add('right')

  let redIndex = 322
  let redDirection = directionArray[1]

  function redGhostMoves () {
    let directionArray = [-28, 1, 28, -1, 27, -27]
    let whereToGo = []
    if (!(squares[redIndex + redDirection]).classList.contains('wall')) {
      directionArray = directionArray.filter(eachDirection => eachDirection !== -redDirection)
      if (redIndex === 392) {
        directionArray = directionArray.filter(eachDirection => eachDirection !== 1)
        directionArray = directionArray.filter(eachDirection => eachDirection !== -1)
      } else if (redIndex === 419) {
        directionArray = directionArray.filter(eachDirection => eachDirection !== 1)
        directionArray = directionArray.filter(eachDirection => eachDirection !== -1)
      } else {
        directionArray = directionArray.filter(eachDirection => eachDirection !== 27)
        directionArray = directionArray.filter(eachDirection => eachDirection !== -27)
      }
      for (const eachDirection of directionArray) {
        if (!(squares[redIndex + eachDirection].classList.contains('wall'))) {
          whereToGo.push(eachDirection)
        }
      }
    } else {
      directionArray.pop()
      directionArray.pop()
      for (const eachDirection of directionArray) {
        if (!(squares[redIndex + eachDirection].classList.contains('wall'))) {
          whereToGo.push(eachDirection)
        }
      }
    }
    // console.log(whereToGo)
    let randomNumber = Math.floor(Math.random() * whereToGo.length)
    // squares.forEach(square => square.classList.remove(`${redDirection}`))
    redDirection = parseFloat(whereToGo[randomNumber])
    // squares.forEach(square => square.classList.add(`${redDirection}`))
    redIndex = parseFloat(parseFloat(redIndex) + parseFloat(redDirection))
    if (redIndex === 392) {
      if (redDirection === -1) {
        redDirection = 27
      }
    } else if (redIndex === 419) {
      if (redDirection === 1) {
        redDirection = -27
      }
    }
    squares.forEach(square => square.classList.remove('red'))
    squares[redIndex].classList.add('red')
  }

  function checkDeath () {
    if (playerIndex === redIndex) {
      clearInterval(timerId2)
      playerIndex = 658
      squares.forEach(square => square.classList.remove('player'))
      squares[playerIndex].classList.add('player')
      redIndex = (width * 11.5)
      squares.forEach(square => square.classList.remove('red'))
      squares[redIndex].classList.add('red')
      window.removeEventListener('keydown', handleKeyDown)
      lives--
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
      redGhostMoves('red')
      window.addEventListener('keydown', handleKeyDown)
      console.log(gameTime)
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