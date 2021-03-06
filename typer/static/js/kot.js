(function ($) {
  $.fn.kot = function(){
    var config = {
                    charWidth : 7, 
                    charHeight : 16
                  }
    var width = this.width();
    var height = this.height();

    var renderer = new KotRenderer(width, height);
    renderer.load();
    renderer.start();
    document.renderer = renderer;

    var canvasElement = renderer.view;
    var storage = new KotStorage();
    var engine = new KotEngine();
    storage.setEngine(engine);
    engine.setEventCallback(renderer.requestMessage)

    var kovElement = $('<div></div>')
                       .width(width)
                       .height(height)
                       .css('position', 'relative');
    var textareaElement = $('<textarea></textarea>').appendTo(kovElement)
                            .width(config.charWidth)
                            .height(height.charHeight)
                            .css('z-index', '0')
                            .css('margin', '0px -1px')
                            .css('padding', '0px 1px')
                            .css('border', 'none')
                            .css('opacity', '0')
                            .css('resize', 'none')
                            .css('outline', 'none')
                            .css('overflow', 'hidden')
                            .css('font', 'inherit')
                            .css('background', 'transparent')
                            .css('position', 'relative');
    var canvasElement = $(renderer.view).appendTo(kovElement)
                          .css('position', 'absolute')
                          .css('top', '0px')
                          .css('left', '0px');

    textareaElement.keydown(function(e){
      var code = e.keyCode;
      if((33<=code && code<=40) || code == 8 || code == 9 || code == 46 || code == 13) {
        console.log(code);
        storage.putCmd(code);
        return false;
      }
    });
    textareaElement.keypress(function(e){
      if(e.which == 13) {return;}
      storage.putChar(e.which);
    });
    canvasElement.click(function(){
      textareaElement.focus();
    });

    this.before(kovElement);
    this.hide();
    
    return this;
  }
  
  //Load kot editor automatically
  $(function(){
    $('textarea.kot').kot();
  });
})(jQuery);

