(function ($) {
  $.fn.kot = function(){
    var width = this.width();
    var height = this.height();

    //TODO: Remove this code and load kot renderer module.
    var stage = new PIXI.Stage(0x66FF99);
    var renderer = PIXI.autoDetectRenderer(width, height);
    renderer.render(stage);

    var canvasElement = renderer.view;

    this.before(renderer.view);
    this.hide();
    return this;
  }
  
  //Load kot editor automatically
  $(function(){
    $('textarea.kot').kot();
  });
})(jQuery);

