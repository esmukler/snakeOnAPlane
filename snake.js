(function() {
  if (window.Snake === undefined) {
    window.SnakeGame = {};
  }

  //  BOARD CLASS

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
    var segments = this.snake.segments;
    for (var i = 0; i < segments.length; i++) {
      // SNAKE goes out of bounds
      if ((segments[i].y >= Board.DIM_Y) || (segments[i].y < 0) ||
      (segments[i].x >= Board.DIM_X) || (segments[i].x < 0)) {
        is_over = true;
      }
      // SNAKE runs into itself
      for (var j = i + 1; j < segments.length; j++) {
        if (segments[i].equals(segments[j])) {
          is_over = true;
        }
      }
    }
    return is_over;
  };

  Board.prototype.updatePoints = function() {
    var points = (this.snake.segments.length - 1) * 10;
    $(".points").html(points + " points");
  }

//  SNAKE CLASS

 var Snake = SnakeGame.Snake = function (board) {
   this.board = board;
   this.segments = [Coord.generateRandom()];
   this.dir = "E";
   this.inputDir = "E";
 }

 Snake.prototype.move = function () {
   this.dir = this.inputDir;
   var newSeg = new Coord(this.segments[0].plus(this.dir));
   this.segments.unshift(newSeg);

   if (!this.eatsApple()) {
     var pos = this.segments.pop();
   } else {
     this.board.regenerateApple();
   }
 };

 Snake.prototype.eatsApple = function() {
   return this.segments[0].equals(this.board.apple.coord)
 };

 Snake.prototype.turn = function (dir) {
   var currentIdx = Snake.DIR.indexOf(this.dir)
   var newIdx = Snake.DIR.indexOf(dir)
   if ((currentIdx + newIdx) % 2 !== 0) {
     this.inputDir = dir;
   }
 };

 Snake.DIR = ["N","E","S","W"];

 //  COORD CLASS

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

 //  APPLE CLASS

 var Apple = SnakeGame.Apple = function(board) {
   this.board = board;
   this.coord = this.randomApple();
 };

 Apple.prototype.randomApple = function() {
   var coord = generateRandom();
   while (this.board.snake.segments.indexOf(coord) !== -1) {
     console.log("hello")
     coord = generateRandom();
   }
  return coord
 };

})();
