(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function ($el) {
    this.board = new SnakeGame.Board();
    this.$el = $el;
    this.bindEvents();
    this.setupBoard();
    this.intervalId = window.setInterval(this.step.bind(this), 500)
  };

  View.prototype.step = function() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();

      this.board.render();
      this.updateColors();
    } else {
      alert("Game Over!");
      window.clearInterval(this.intervalId);
    }
  };


  View.prototype.setupBoard = function ( ) {
    var html = "<ul class='game-board group'>";
    var id = 0;
    for (var i = 0; i < SnakeGame.Board.DIM_X; i++) {
      for (var j = 0; j < SnakeGame.Board.DIM_Y; j++) {
        html += "<li data-id='" + id + "'></li>"
        id += 1;
      }
    }
    html += "</ul>"
    this.$el.html(html);
  };

  View.prototype.updateColors = function() {
    $("li").filter(".snake").removeClass("snake");
    $("li").filter(".apple").removeClass("apple");

    this.board.snake.segments.forEach( function(seg) {
      var snakeId = (seg.x * SnakeGame.Board.DIM_X) + seg.y
      var $snakeTile = $("li[data-id='" + snakeId + "']")
      $snakeTile.addClass("snake");
    }.bind(this))

    var apple_coord = this.board.apple.coord
    var appleId = apple_coord.x * SnakeGame.Board.DIM_X + apple_coord.y
    var $appleTile = $("li[data-id='" + appleId + "']")
    $appleTile.addClass("apple");

  };

  View.prototype.bindEvents = function () {
    var view = this;
    $(document).on("keydown", function(event){
      event.preventDefault();
      view.snakeTurn(event.which);
    })
  };

  View.prototype.snakeTurn = function(code) {
    if(code === 37){
      this.board.snake.turn("W");
    } else if (code === 38) {
      this.board.snake.turn("N");
    } else if (code === 39) {
      this.board.snake.turn("E");
    } else if (code === 40) {
      this.board.snake.turn("S");
    }
  };

})();
