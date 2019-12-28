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