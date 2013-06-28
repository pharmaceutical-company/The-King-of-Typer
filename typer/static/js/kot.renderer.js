KotRenderer = function(width, height) {

  var stage = new PIXI.Stage(0x101010);
  var renderer = PIXI.autoDetectRenderer(width, height);

  var effectRenderer = new KotEffectRenderer();
  var characterRenderer = new KotCharacterRenderer(80, 25);

  this.view = renderer.view;

  var loaded = false;

  var messageQueue = new Array();

  this.requestMessage = function(message) {
    messageQueue.push(message);
  }

  this.load = function() {
    // load somethings... (sprites, resources, etc)
    loaded = true;
  }

  this.start = function() {
    if(loaded) loop();
    else return false;
  }

  function loop() {
    requestAnimFrame(loop);
    update();
    draw();
  }

  function update() {
    doMessages();
    effectRenderer.update();
  }

  function doMessages() {
    while(messageQueue.length > 0) {
      message = messageQueue.shift();
      for(var i=0; i<message.tokens.length; ++i) {
        for(var j=0; j<message.tokens[i].length; ++j) {
          characterRenderer.addToken(message.tokens[i][j]);
        }
        characterRenderer.newLine();
      }
    }
  }

  function draw() {
    characterRenderer.draw(stage);
    effectRenderer.draw(stage)
    renderer.render(stage);
  }

}

KotCharacterRenderer = function(columns, rows) {

  var characterArray = new Array(),
      that = this,
      firstRow = 0,
      drawPosition = 0,
      changed = false;

  this.length = function() { return characterArray.length; }

  function addCharacter(value, position) {
    value = new Character(value);

    if(position <= 0) characterArray = [value].concat(characterArray);
    else if(position > characterArray.length) characterArray.push(value);
    else {
      tempArray = characterArray.slice(0, position);
      tempArray.push(value);
      characterArray = tempArray.
          concat(characterArray.slice(position+1, characterArray.length));
    }

    changed = true;
  }

  this.newLine = function() {
    addCharacter('\n', drawPosition++);
  }

  this.addToken = function(token) {
    // if token.kind == ??: color = ??
    for(var i=0; i<token.str.length; ++i) {
      addCharacter(token.str[i], drawPosition++);
    }
  }

  this.removeCharacter = function(position) {
    characterArray = (position < 0 || position > characterArray.length) ?
        characterArray : 
        characterArray.slice(0, position).
        concat(characterArray.slice(position+1, characterArray.length));

    changed = true;
  }

  function getPositionOfFirstOfLine(line) {
    var columnCount = 0, rowCount = 0;

    for(var i=0; i<characterArray.length; ++i) {
      if(rowCount >= line) return i;
      if(characterArray[i] == '\n') {
        columnCount = 0;
        ++rowCount;
      } else {
        ++columnCount;
        if(columnCount > columns) {
          columnCount = 0;
          ++rowCount;
        }
      }
    }

    return characterArray.length;
  }

  this.draw = function(stage) {
    var columnCount = 0, rowCount = 0;

    if(changed == false) return;

    for(var i=getPositionOfFirstOfLine(firstRow); i<characterArray.length; ++i) {
      if(characterArray[i].value == '\n') {
        columnCount = 0;
        ++rowCount;
        continue;
      }

      characterArray[i].displayObject.position.x = columnCount * 10;
      characterArray[i].displayObject.position.y = rowCount * 16;

      stage.addChild(characterArray[i].displayObject);

      ++columnCount;

      if(columnCount > columns) {
        columnCount = 0;
        ++rowCount;
      }

      if(rowCount > rows) break;
    }
  }

}

Character = function(value) {

  this.value = value;
  var color = "white";

  if(value != '\n')
    this.displayObject =
        new PIXI.Text(value, { font: "14px Monaco", fill: color, align: "center" });

}

KotEffectRenderer = function() {

  var effectArray = new Array();

  this.addEffect = function(effect) {
    effectArray.push(effect);
  }

  this.update = function() {
    for(var i=0; i<effectArray.length; ++i) {
      effectArray[i].update();
    }
  }

  this.draw = function(stage) {
    for(var i=0; i<effectArray.length; ++i) {
      effectArray[i].draw(stage);
      if(effectArray[i].isFinished()) removeEffect(i--);
    }
  }

  function removeEffect(position) {
    effectArray = (position < 0 || position > effectArray.length) ?
        effectArray : effectArray.slice(0, position).concat(effectArray.slice(position+1, effectArray.length));
  };

}

Effect = function(effectPrototype, value, stage) {

  var currentFrame = 0;

  var finished = false;
  var drawingObject;

  this.update = function() {
    currentFrame++;
    if(effectPrototype.type == "func")
      drawingObject = effectPrototype.update(currentFrame, value);
    else ;

    if(currentFrame == effectPrototype.frameLength)
      finished = true;
  }

  this.draw = function() {
    if(effectPrototype.type == "func" && drawingObject != null)
      effectPrototype.draw(drawingObject, stage);
    else ;
  }

  this.isFinished = function() {
    return finished;
  }

}

var EFFECT_PROTOTYPE_MAP = {
/*
  NAME: { type: "image|func", frameLength: FRAME_LENGTH, (if type==image)header: "FILE_HEADER", (if type==func)update&draw: function(args) }
*/

  DRAW_STRING: {
      type: "func",
      frameLength: 1,
      update: function(frame, value) {
        if(frame <= this.frameLength)
          return new PIXI.Text(value, { font: "14px monospace", fill: "white" });
        else
          return null;
      },
      draw: function(drawingObject, stage) {
        stage.addChild(drawingObject);
      },
  },
}
