function init() {

  //  dom variables
  const startBtn = document.querySelector('.start')
  const grid = document.querySelector('.grid')
  const squares = []

  // game variables
  const width = 28
  const height = 31
  let playerIndex = 686
  let redIndex = (width * 12.5)
  let score = 0
  let lives = 2
  let timerId1 = null
  let timerId2 = null
  let timerId3 = null
  let countDownTime = 3
  let gameTime = 0
  const speed = 1000

  // loop as many times as width times the height to fill the grid
  Array(width * height).join('.').split('.').forEach(() => {
    // create 
    const square = document.createElement('div')
    square.classList.add('grid-item')
    squares.push(square)
    grid.appendChild(square)
  })

  // add food class to squares
  squares.forEach(square => square.classList.add('food'))

  // build the top wall
  for (let i = 0; i < width; i++) {
    squares[i].classList.remove('food')
    squares[i].classList.add('wall')
  }
  // bottom wall
  for (let i = 840; i < width * height; i++) {
    squares[i].classList.add('wall')
  }
  // left wall
  for (let i = 0; i < 840; i = i + width) {
    squares[i].classList.add('wall')
  }
  // right wall
  for (let i = width - 1; i < width * height; i = i + width) {
    squares[i].classList.add('wall')
  }
  // middle top wall
  for (let i = (width / 2) - 1; i <= ((width / 2) - 1) + (5 * width); i = i + width) {
    squares[i].classList.add('wall')
  }
  for (let i = width / 2; i <= (width / 2) + (5 * width); i = i + width) {
    squares[i].classList.add('wall')
  }
  // top row of walls
  for (let i = (width * 2) + 2; i <= (width * 2) + 5; i++) {
    squares[i].classList.add('wall')
  }
  for (let i = (width * 3) + 2; i <= (width * 3) + 5; i++) {
    squares[i].classList.add('wall')
  }
  for (let i = (width * 2) + 7; i <= (width * 2) + 11; i++) {
    squares[i].classList.add('wall')
  }
  for (let i = (width * 3) + 7; i <= (width * 3) + 11; i++) {
    squares[i].classList.add('wall')
  }
  
  for (let i = (width * 3) - 3; i >= (width * 3) - 6; i--) {
    squares[i].classList.add('wall')
  }
  for (let i = (width * 3) - 8; i >= (width * 3) - 12; i--) {
    squares[i].classList.add('wall')
  }
  for (let i = (width * 4) - 3; i >= (width * 4) - 6; i--) {
    squares[i].classList.add('wall')
  }
  for (let i = (width * 4) - 8; i >= (width * 4) - 12; i--) {
    squares[i].classList.add('wall')
  }

  // hole in side walls
  squares[420].classList.remove('wall')
  squares[420 + width - 1].classList.remove('wall')

  // places player at the starting position when grid has finished building, stops player from crossing walls and only allows player to move once the game starts
  squares[playerIndex].classList.add('player')
  function handleKeyDown(e) {
    switch (e.keyCode) {
      case 39:
        if (playerIndex === 420 + width - 1) {
          squares[playerIndex].classList.remove('food')
          if (squares[420].classList.contains('food')) {
            score++
          }
          playerIndex = 420
        } else if (!(squares[playerIndex + 1].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex + 1].classList.contains('food')) {
            score++
          }
          playerIndex++
        }
        break
      case 37:
        if (playerIndex === 420) {
          squares[playerIndex].classList.remove('food')
          if (squares[420 + width - 1].classList.contains('food')) {
            score++
          }
          playerIndex = 420 + width - 1
        } else if (!(squares[playerIndex - 1].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex - 1].classList.contains('food')) {
            score++
          }
          playerIndex--
        }
        break
      case 40:
        if (!(squares[playerIndex + width].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex + width].classList.contains('food')) {
            score++
          }
          playerIndex += width
        }
        break
      case 38:
        if (!(squares[playerIndex - width].classList.contains('wall'))) {
          squares[playerIndex].classList.remove('food')
          if (squares[playerIndex - width].classList.contains('food')) {
            score++
          }
          playerIndex -= width
        } 
        break
      default:
        console.log('player shouldnt move')
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
  }

  // places red ghost at starting position
  squares[redIndex].classList.add('red')
  function redGhostMoves() {
    const randomNumber = Math.floor(Math.random() * 4)
    switch (randomNumber) {
      case 0:
        if (!(squares[redIndex + 1].classList.contains('wall'))) {
          redIndex++
        }
        break
      case 1:
        if (!(squares[redIndex - 1].classList.contains('wall'))) {
          redIndex--
        }
        break
      case 2:
        if (!(squares[redIndex + width].classList.contains('wall'))) {
          redIndex += width
        }
        break
      case 3:
        if (!(squares[redIndex - width].classList.contains('wall'))) {
          redIndex -= width
        }
        break
    }
    squares.forEach(square => square.classList.remove('red'))
    squares[redIndex].classList.add('red')
  }

  function checkDeath () {
    if (playerIndex === redIndex) {
      // console.log('yes')
      clearInterval(timerId2)
      playerIndex = 686
      squares.forEach(square => square.classList.remove('player'))
      squares[playerIndex].classList.add('player')
      redIndex = (width * 12.5)
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
      console.log(`The timer is on ${countDownTime}`)
      countDownTime--
    } else if (countDownTime === 0) {
      console.log('GO!')
      countDownTime--
    } else {
      clearInterval(timerId1)
    }
  }

  function gameTimer () {
    if (countDownTime < 0) {
      redGhostMoves()
      window.addEventListener('keydown', handleKeyDown)
      gameTime++
      // console.log(gameTime)
    }
  }

  function startTimers () {
    timerId1 = setInterval(countDownTimer, 1000)
    timerId2 = setInterval(gameTimer, speed)
    timerId3 = setInterval(checkDeath, 1)
  }

  // event handlers
  startBtn.addEventListener('click', startTimers)
}

window.addEventListener('DOMContentLoaded', init)