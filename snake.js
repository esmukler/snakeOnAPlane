(function() {
  if (window.Snake === undefined) {
    window.SnakeGame = {};
  }

 var Snake = SnakeGame.Snake = function (board) {
   this.board = board;
   this.segments = [Coord.generateRandom()];
   this.dir = "E";
 }

 Snake.prototype.move = function () {
   var newSeg = new Coord(this.segments[0].plus(this.dir));
   this.segments.unshift(newSeg);
   console.log(this.eatsApple())

   if (!this.eatsApple()) {
     var pos = this.segments.pop();
   } else {
     console.log("eats apple!")
     this.board.regenerateApple();
   }
 };

 Snake.prototype.eatsApple = function() {
   return this.segments[0].equals(this.board.apple.coord)
 };

 Snake.prototype.turn = function (dir) {
   this.dir = dir;
 };

 Snake.DIR = ["N","E","S","W"];

 var Coord = SnakeGame.Coord = function (pos) {
   this.x = pos[0];
   this.y = pos[1];
 }

 Coord.prototype.plus = function (dir) {
   var addCoord = [];
   switch (dir) {
     case 'N':
       addCoord = [-1, 0];
       break;
     case 'E':
       addCoord = [0, 1];
       break;
     case 'S':
       addCoord = [1, 0];
       break;
     case 'W':
       addCoord = [0, -1];
       break;
   }
   return [this.x + addCoord[0], this.y + addCoord[1]];
 };

 Coord.prototype.equals = function(otherCoord) {
   return (this.x === otherCoord.x && this.y === otherCoord.y)
 };

 var generateRandom = Coord.generateRandom = function (){
   var x = Math.floor(Math.random() * Board.DIM_X);
   var y = Math.floor(Math.random() * Board.DIM_Y);
   return new Coord([x,y]);
 };

 var Apple = SnakeGame.Apple = function(board) {
   this.board = board;
   this.coord = this.randomApple();
 };

 Apple.prototype.randomApple = function() {
   var coord = generateRandom();

   while (this.board.snake.segments.indexOf(coord) !== -1) {
     coord = generateRandom();
   }
  return coord
 };

 var Board = SnakeGame.Board = function () {
   this.grid = this.setUpBoard();
   this.snake = new Snake(this);
   this.apple = new Apple(this);
 }

 Board.DIM_X = 20;
 Board.DIM_Y = 20;

Board.prototype.setUpBoard = function () {
  var grid = [];
  for (var i = 0; i < Board.DIM_X; i++) {
    grid.push([]);
    for (var j = 0; j < Board.DIM_Y; j++) {
      grid[i].push(".");
    }
  }
  return grid;
};

Board.prototype.regenerateApple = function() {
  this.apple = null;
  this.apple = new Apple(this)
};

Board.prototype.is_over = function() {
  var is_over = false
  this.snake.segments.forEach( function(seg) {
    if ((seg.y >= Board.DIM_Y) || (seg.y < 0) || (seg.x >= Board.DIM_X) || (seg.x < 0)) {
      is_over = true;
    }
  })
  return is_over;
};

Board.prototype.render = function () {
  if (this.is_over()) {
    console.log("Game Over!")
    this.snake.segments = [];
  } else {
    var grid = this.grid;
    var gridString = ""
    for (var i = 0; i < Board.DIM_X; i++) {
      for (var j = 0; j < Board.DIM_Y; j++) {
        grid[i][j] = ".";
      }
    }
    this.snake.segments.forEach(function (el){
      grid[el.x][el.y] = "s";
    })
    for (var i = 0; i < Board.DIM_X; i++) {
      for (var j = 0; j < Board.DIM_Y; j++) {
        gridString += grid[i][j];
      }
      gridString += "\n";
    }
    console.log(gridString);
  }
}

})();
