KotRenderer = function(width, height){

  var stage = new PIXI.Stage(0x66FF99);
  var renderer = PIXI.autoDetectRenderer(width, height);
  renderer.render(stage);

  this.view = renderer.view;
  
  this.setToken = function(token) {
  }

}

