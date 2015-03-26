(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function ($el, board) {
    this.$el = $el;
    this.board = board;
    this.setupBoard();
    this.bindEvents();
    this.paused = true;
    this.speed = 500;
  };

  View.prototype.playOrPause = function() {
    if (this.paused) {
      this.intervalId = window.setInterval(this.step.bind(this), this.speed)
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

  View.prototype.bindEvents = function () {
    var view = this;
    $(".play-or-pause").click(function(event) {
      view.speed = $('input[name="speed"]:checked').val();
    })

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

    $("button.reset").click( function(event) {
      view.reset();
    })
  };

  View.prototype.reset = function() {
    $(".modal").toggleClass("hidden");
    $("body").css("overflow", "initial");
    this.board = null;
    this.$el.off();
    this.board = new SnakeGame.Board();
    this.setupBoard();
    this.playOrPause();
    $(".points").html("0 points")
  };

  View.prototype.step = function() {
    this.board.snake.move();
    if (this.board.is_over()) {
      this.gameOver();
    } else {
      this.updateColors();
    }
  };

  View.prototype.gameOver = function() {
    window.clearInterval(this.intervalId);
    $(".modal").toggleClass("hidden");
    $("body").css("overflow", "hidden");
    $(".modal-form span.points").html(this.board.points)
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
