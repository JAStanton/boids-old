// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Boids = (function() {

    Boids.prototype.boids = [];

    Boids.prototype.BOID_RADIUS = 6;

    Boids.prototype.BOID_LEVEL_OF_ATTRACTION = 100;

    function Boids(options) {
      if (options == null) {
        options = {};
      }
      this.tick = __bind(this.tick, this);

      this.options = options;
      this.bindEvents();
      this.initialize();
    }

    Boids.prototype.initialize = function() {
      this.initStats();
      this.initCanvas();
      this.initBoids();
      return this.tick();
    };

    Boids.prototype.bindEvents = function() {
      var _this = this;
      return window.onresize = function() {
        return _this.setCanvasDimensions();
      };
    };

    Boids.prototype.initStats = function() {
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.right = '0px';
      this.stats.domElement.style.top = '0px';
      return document.body.appendChild(this.stats.domElement);
    };

    Boids.prototype.tick = function() {
      this.stats.begin();
      window.requestAnimationFrame(this.tick);
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.moveBoids();
      this.drawBoids();
      return this.stats.end();
    };

    Boids.prototype.initBoids = function() {
      var boid, i, max_x, max_y, _i, _ref;
      for (i = _i = 0, _ref = this.options.num; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        boid = {};
        max_x = this.random(0, this.width - this.BOID_RADIUS * 2);
        max_y = this.random(0, this.height - this.BOID_RADIUS * 2);
        boid.position = new Vector(max_x, max_y);
        boid.velocity = new Vector(0, 0);
        this.boids.push(boid);
      }
      return console.log(this.boids);
    };

    Boids.prototype.moveBoids = function() {
      var b, v1, v2, _i, _len, _ref, _results;
      _ref = this.boids;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        v1 = this.rule1(b);
        v2 = this.rule2(b);
        b.velocity = vectorAdd(vectorAdd(b.velocity, v1), v2);
        _results.push(b.position = vectorAdd(b.position, b.velocity));
      }
      return _results;
    };

    Boids.prototype.drawBoids = function() {
      var b, _i, _len, _ref, _results;
      _ref = this.boids;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        _results.push(this.drawCircle(b.position.x, b.position.y));
      }
      return _results;
    };

    Boids.prototype.rule1 = function(boid) {
      var b, percieved_center, _i, _len, _ref;
      percieved_center = new Vector(0, 0);
      _ref = this.boids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        if (b !== boid) {
          percieved_center = vectorAdd(percieved_center, b.position);
        }
      }
      percieved_center = vectorDivide(percieved_center, this.boids.length - 1);
      return vectorDivide(vectorSubtract(percieved_center, boid.position), this.BOID_LEVEL_OF_ATTRACTION);
    };

    Boids.prototype.rule2 = function(boid) {
      var b, c, _i, _len, _ref;
      c = new Vector(0, 0);
      _ref = this.boids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        if (b !== boid) {
          if (Math.abs(vectorSubtract(b.position, boid.position)) < 100) {
            c = vectorSubtract(c, vectorSubtract(b.position, boid.position));
          }
        }
      }
      return c;
    };

    Boids.prototype.rule3 = function(boid) {};

    Boids.prototype.initCanvas = function() {
      this.canvas = document.getElementById(this.options.canvas_id);
      this.ctx = this.canvas.getContext("2d");
      return this.setCanvasDimensions();
    };

    Boids.prototype.setCanvasDimensions = function() {
      this.canvas.width = this.width = document.body.clientWidth;
      return this.canvas.height = this.height = document.body.clientHeight;
    };

    Boids.prototype.drawCircle = function(x, y) {
      this.ctx.beginPath();
      this.ctx.arc(x + this.BOID_RADIUS, y + this.BOID_RADIUS, this.BOID_RADIUS, Math.PI * 2, 0);
      this.ctx.closePath();
      return this.ctx.fill();
    };

    Boids.prototype.random = function(lo, hi) {
      return Math.floor(Math.random() * hi) + lo;
    };

    return Boids;

  })();

  window.Vector = function(x, y) {
    if (arguments.length > 0) {
      this.x = x;
      return this.y = y;
    }
  };

  window.vectorAdd = function(_this, that) {
    return new Vector(_this.x + that.x, _this.y + that.y);
  };

  window.vectorSubtract = function(_this, that) {
    return new Vector(_this.x - that.x, _this.y - that.y);
  };

  window.vectorDivide = function(_this, scalar) {
    return new Vector(_this.x / scalar, _this.y / scalar);
  };

}).call(this);
