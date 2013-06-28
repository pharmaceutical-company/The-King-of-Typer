(function ($) {
  $.fn.kot = function(){
    var width = this.width();
    var height = this.height();

    var renderer = new KotRenderer(width, height);
    renderer.load();
    renderer.start();
    document.renderer = renderer;

    var canvasElement = renderer.view;

    this.before(canvasElement);
    this.hide();
    return this;
  }
  
  //Load kot editor automatically
  $(function(){
    $('textarea.kot').kot();
  });
})(jQuery);

