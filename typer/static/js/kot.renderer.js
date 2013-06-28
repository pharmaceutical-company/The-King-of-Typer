KotRenderer = function(width, height){

  var stage = new PIXI.Stage(0x101010);
  var renderer = PIXI.autoDetectRenderer(width, height);

  this.view = renderer.view;

  this.loaded = false;
  this.requestQueue = new Array();

  this.requestToken = function(token) {
    requestQueue.push(token);
  }

  this.load = function() {
    // load somethings... (sprites, resources, etc)
    loaded = true;
  }

  this.start = function() {
    loop();
  }

  function loop() { requestAnimFrame(loop);
    doRequests();
    draw();
  }

  function doRequests() {
    
  }

  function draw() {
    renderer.render(stage);
  }

}

