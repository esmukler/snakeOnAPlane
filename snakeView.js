(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function ($el, board) {
    this.$el = $el;
    this.board = board;
    this.bindEvents();
    this.setupBoard();
    this.paused = true;
  };

  View.prototype.playOrPause = function() {
    if (this.paused) {
      this.intervalId = window.setInterval(this.step.bind(this), 250)
      $(".play-or-pause").html("Pause (spacebar)");
      this.paused = false;
      console.log("if")
    } else {
      window.clearInterval(this.intervalId);
      $(".play-or-pause").html("Play!");
      this.paused = true;
      console.log("else")
    }
  };

  View.prototype.step = function() {
    this.board.snake.move();
    if (this.board.is_over()) {
      window.clearInterval(this.intervalId);

      $(".message").html("Game Over!")
      $(".message").css("background", "red")
      $(".play-or-pause").html("click 'Snake!' to start a new game")
    } else {
      this.updateColors();
      this.board.updatePoints();
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
      if (!view.paused) {
        view.snakeTurn(event.which);
      }
    })
    $(document).on("keydown", function(event){
      event.preventDefault();
      if (event.which === 32) {
        view.playOrPause();
      }
    })
    $(".play-or-pause").click( function(event) {
      view.playOrPause();
    });
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
