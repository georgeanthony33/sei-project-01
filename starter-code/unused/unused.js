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


// create redGhostObject with ghostMoves method
const redGhostObject = {
  index: 322,
  direction: 1,
  directionArray: [1, -1, 28, -28, 27, -27],
  whereToGo: [],
  startPosition () {},
  ghostMoves () {
    const newPos = this.index + this.direction
    this.directionArray = [1, -1, 28, -28, 27, -27]
    this.whereToGo = []
    if (walls[newPos] === 0) {
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
        if (!(squares[potentialPos].classList.contains('wall'))) {
          this.whereToGo.push(eachDirection)
        }
      }
    } else {
      this.directionArray.pop()
      this.directionArray.pop()
      for (const eachDirection of this.directionArray) {
        const potentialPos = this.index + eachDirection
        if (!(squares[potentialPos].classList.contains('wall'))) {
          this.whereToGo.push(eachDirection)
        }
      }
    }
    const randomNumber = Math.floor(Math.random() * this.whereToGo.length)
    // squares.forEach(square => square.classList.remove(`${this.Direction}`))
    this.direction = parseFloat(this.whereToGo[randomNumber])
    console.log(this.direction)
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
    console.log(this.direction)
    squares.forEach(square => square.classList.remove('red'))
    squares[this.index].classList.add('red')
  }
}