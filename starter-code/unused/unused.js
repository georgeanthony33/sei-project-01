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

const wallsArray = [
  2,0,0,0,0,0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,3,
  1,X,F,F,F,F,X,F,F,F,F,F,X,1,1,X,F,F,F,F,F,X,F,F,F,F,X,1,
  1,F,6,0,0,7,F,6,0,0,0,7,F,1,1,F,6,0,0,0,7,F,6,0,0,7,F,1,
  1,B,1,N,N,1,F,1,N,N,N,1,F,1,1,F,1,N,N,N,1,F,1,N,N,1,B,1,
  1,F,9,0,0,8,F,9,0,0,0,8,F,9,8,F,9,0,0,0,8,F,9,0,0,8,F,1,
  1,X,F,F,F,F,X,F,F,X,F,F,X,F,F,X,F,F,X,F,F,X,F,F,F,F,X,1,
  1,F,6,0,0,7,F,6,7,F,6,0,0,0,0,0,0,7,F,6,7,F,6,0,0,7,F,1,
  1,F,9,0,0,8,F,1,1,F,9,0,0,3,2,0,0,8,F,1,1,F,9,0,0,8,F,1,
  1,X,F,F,F,F,X,1,1,X,F,F,X,1,1,X,F,F,X,1,1,X,F,F,F,F,X,1,
  5,0,0,0,0,7,F,1,5,0,0,7,N,1,1,N,6,0,0,4,1,F,6,0,0,0,0,4,
  N,N,N,N,N,1,F,1,2,0,0,8,N,9,8,N,9,0,0,3,1,F,1,N,N,N,N,N,
  N,N,N,N,N,1,F,1,1,Z,N,N,Z,N,N,Z,N,N,Z,1,1,F,1,N,N,N,N,N,
  N,N,N,N,N,1,F,1,1,N,6,0,0,D,D,0,0,7,N,1,1,F,1,N,N,N,N,N,
  0,0,0,0,0,8,F,9,8,N,1,R,R,U,U,L,L,1,N,9,8,F,9,0,0,0,0,0,
  N,N,N,N,N,N,X,N,N,Z,1,R,R,U,U,L,L,1,Z,N,N,X,N,N,N,N,N,N,
  0,0,0,0,0,7,F,6,7,N,1,R,R,U,U,L,L,1,N,6,7,F,6,0,0,0,0,0,
  N,N,N,N,N,1,F,1,1,N,9,0,0,0,0,0,0,8,N,1,1,F,1,N,N,N,N,N,
  N,N,N,N,N,1,F,1,1,Z,N,N,N,N,N,N,N,N,Z,1,1,F,1,N,N,N,N,N,
  N,N,N,N,N,1,F,1,1,N,6,0,0,0,0,0,0,7,N,1,1,F,1,N,N,N,N,N,
  2,0,0,0,0,8,F,9,8,N,9,0,0,3,2,0,0,8,N,9,8,F,9,0,0,0,0,3,
  1,X,F,F,F,F,X,F,F,X,F,F,X,1,1,X,F,F,F,F,F,F,F,F,F,F,F,1,
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

const wallsArray2 = [
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

smartMove () {
  
  // Add one smart direction to the direction array. If ghost can go that way then it will be in there twice now, increasing the chance of it going that way. If the ghost cannot go that way then it will not be considered at all for the next direction

  const rowDifference = this.currentRow - pacMan.currentRow
  const columnDifference = this.currentColumn - pacMan.currentColumn
  // const positiveRowDifference = rowDifference < 0 ? -rowDifference : rowDifference
  // const positiveColumnDifference = columnDifference < 0 ? -columnDifference : columnDifference
  let smartDirectionsArray = []
  // this.whereToGo = []

  if (rowDifference > 0) {
    if (columnDifference > 0) {
      smartDirectionsArray = [-1, -28]
    } else if (columnDifference < 0) {
      smartDirectionsArray = [1, -28]
    } else {
      smartDirectionsArray = [-28]
    }
  } else if (rowDifference < 0) {
    if (columnDifference > 0) {
      smartDirectionsArray = [-1, 28]
    } else if (columnDifference < 0) {
      smartDirectionsArray = [1, 28]
    } else {
      smartDirectionsArray = [28]
    }
  } else {
    if (columnDifference > 0) {
      smartDirectionsArray = [-1]
    } else {
      smartDirectionsArray = [1]
    }
  }

  this.whereToGo = smartDirectionsArray.concat(smartDirectionsArray).concat(smartDirectionsArray)
}

closingIn () {
  const rowDifference = this.currentRow - pacMan.currentRow
  const columnDifference = this.currentColumn - pacMan.currentColumn
  this.distanceBetween = Math.sqrt((rowDifference ** 2) + (columnDifference ** 2))
  console.log(this.distanceBetween)
  if (this.distanceBetween < 10) {
    this.whereToGo = this.whereToGo.filter(eachDirection => eachDirection !== ((-1) * (this.currentDirection)))
    console.log('yes', this.whereToGo)
  }
}

switch (this.previousDirection) {
  case -1:
    switch (this.currentDirection) {
      case -1:
        squares[this.currentIndex].classList.add('leftleft')
        break
      case 1:
        squares[this.currentIndex].classList.add('leftright')
        break
      case 28:
        squares[this.currentIndex].classList.add('leftdown')
        break
      case -28:
        squares[this.currentIndex].classList.add('leftup')
        break
    }
    break
  case -28:
    switch (this.currentDirection) {
      case -1:
        squares[this.currentIndex].classList.add('upleft')
        break
      case 1:
        squares[this.currentIndex].classList.add('upright')
        break
      case 28:
        squares[this.currentIndex].classList.add('updown')
        break
      case -28:
        squares[this.currentIndex].classList.add('upup')
        break
    }
    break
  case 1:
    switch (this.currentDirection) {
      case -1:
        squares[this.currentIndex].classList.add('rightleft')
        break
      case 1:
        squares[this.currentIndex].classList.add('rightright')
        break
      case 28:
        squares[this.currentIndex].classList.add('rightdown')
        break
      case -28:
        squares[this.currentIndex].classList.add('rightup')
        break
    }
    break
  case 28:
    switch (this.currentDirection) {
      case -1:
        squares[this.currentIndex].classList.add('downleft')
        break
      case 1:
        squares[this.currentIndex].classList.add('downright')
        break
      case 28:
        squares[this.currentIndex].classList.add('downdown')
        break
      case -28:
        squares[this.currentIndex].classList.add('downup')
        break
    }
    break
}