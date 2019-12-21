function init() {

  //  dom variables
  const grid = document.querySelector('.grid')
  const squares = []

  // game variables
  const width = 28
  const height = 31
  let playerIndex = 686

  // loop as many times as width times the width to fill the grid
  Array(width * height).join('.').split('.').forEach(() => {
    // create 
    const square = document.createElement('div')
    square.classList.add('grid-item')
    squares.push(square)
    grid.appendChild(square)
  })

  // build the top wall
  for (let i = 0; i < width; i++) {
    squares[i].classList.add('wall')
  }

  // places player at the starting position when grid has finished building
  squares[playerIndex].classList.add('player')
  function handleKeyDown(e) {
    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) {
          playerIndex++
        }
        break
      case 37:
        if (playerIndex % width > 0) {
          playerIndex--
        }
        break
      case 40:
        if (playerIndex + width < width * height) {
          playerIndex += width 
        }
        break
      case 38:
        if ((playerIndex - width >= 0) && !(squares[playerIndex - width].classList == 'grid-item wall')) {
          playerIndex -= width
        } 
        break
      default:
        console.log('player shouldnt move')
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    console.log('current player index is' , playerIndex)
  }

  // event handlers
  window.addEventListener('keydown', handleKeyDown)

}

window.addEventListener('DOMContentLoaded', init)