class window.Boids

  boids: []
  BOID_RADIUS: 5
  BOID_LEVEL_OF_ATTRACTION: 400
  draw_boid_velocity: true

  constructor: (options = {}) ->
    @options = options
    @bindEvents()
    @initialize()

  initialize: ->
    @initStats()
    @initCanvas()
    @initBoids()

    # Lets do this!
    @tick()

  bindEvents: ->
    window.onresize = =>
      @setCanvasDimensions()

  initStats: ->
    @stats = new Stats()
    @stats.domElement.style.position = 'absolute'
    @stats.domElement.style.right = '0px'
    @stats.domElement.style.top = '0px'
    document.body.appendChild @stats.domElement

  tick: =>
    @stats.begin()
    window.requestAnimationFrame @tick
    @ctx.clearRect 0, 0, @width, @height
    @moveBoids()
    @drawBoids()
    @stats.end()

  #############
  # Boids Logic
  #############

  initBoids: ->
    for i in [0...@options.num]
      boid = {}
      max_x = @random(0, @width  - @BOID_RADIUS * 2)
      max_y = @random(0, @height - @BOID_RADIUS * 2)
      boid.position = new Vector(max_x, max_y)
      boid.velocity = new Vector(0, 0)
      @boids.push boid

  moveBoids: ->
    for b in @boids
      v1 = @rule1 b
      v2 = @rule2 b
      v3 = @rule3 b
      b.velocity = vectorAdd(b.velocity, v1)
      b.velocity = vectorAdd(b.velocity, v2)
      b.velocity = vectorAdd(b.velocity, v3)
      b.position = vectorAdd(b.position, b.velocity)


  rule1: (boid) ->
    center = new Vector(0, 0)
    for b in @boids
      if b != boid
        center = vectorAdd(center, b.position)

    center = vectorDivide(center, @boids.length - 1)
    vectorDivide(vectorSubtract(center, boid.position), @BOID_LEVEL_OF_ATTRACTION)

  rule2: (boid) ->
    c = new Vector(0, 0)
    for b in @boids
      if b != boid
        if Math.abs( vectorSubtract(b.position, boid.position) ) < 100
          c = vectorSubtract(c, vectorSubtract(b.position, boid.position) )

    return c

  rule3: (boid) ->
    pv = new Vector(0, 0)
    for b in @boids
      if b != boid
        pv = vectorAdd(pv, b.velocity)

    pv = vectorDivide(pv, @boids.length - 1)
    vectorDivide( vectorSubtract(pv, boid.velocity) , 8)

  drawBoids: ->
    for b in @boids
      @drawCircle b.position.x, b.position.y
      @drawBoidVelocity b if @draw_boid_velocity


  drawBoidVelocity: (boid) ->
    a = boid.position
    b = vectorAdd(boid.position, boid.velocity)
    b = vectorAdd(b, vectorMultiplicationScalar(boid.velocity, 2.5))
    @drawLine(a.x + @BOID_RADIUS, a.y  + @BOID_RADIUS, b.x  + @BOID_RADIUS, b.y  + @BOID_RADIUS)

  ##########
  # Renderer
  ##########

  initCanvas: ->
    @canvas = document.getElementById @options.canvas_id
    @ctx = @canvas.getContext "2d"
    @setCanvasDimensions()

  setCanvasDimensions: ->
    @canvas.width = @width = document.body.clientWidth
    @canvas.height = @height = document.body.clientHeight

  ##########
  # Drawing
  ##########
  drawLine: (x1, y1, x2, y2) ->
    @ctx.beginPath()
    @ctx.moveTo(x1, y1)
    @ctx.lineTo(x2, y2)
    @ctx.strokeStyle = '#FF0000'
    @ctx.stroke()

  drawCircle: (x, y) ->
    @ctx.beginPath()
    @ctx.arc(x + @BOID_RADIUS, y + @BOID_RADIUS, @BOID_RADIUS, Math.PI*2, 0)
    @ctx.closePath()
    @ctx.fill()

  ##########
  # Helpers
  ##########
  random: (lo, hi) ->
    Math.floor(Math.random() * hi) + lo

##########
# Math
##########
window.Vector = (x, y) ->
  if arguments.length > 0
    this.x = x
    this.y = y

window.vectorAdd = (_this, that) ->
  new Vector(_this.x + that.x, _this.y + that.y)

window.vectorSubtract = (_this, that) ->
  new Vector(_this.x - that.x, _this.y - that.y)

window.vectorDivide = (_this, scalar) ->
  new Vector(_this.x / scalar, _this.y / scalar)

window.vectorLength = (_this, that) ->
  Math.sqrt((_this.x * that.x) + (_this.y * that.y))

window.vectorMultiplicationScalar = (v, scalar) ->
  new Vector(v.x * scalar, v.y * scalar)


