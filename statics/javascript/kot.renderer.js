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
      characterRenderer.clear();
      if(characterRenderer.cursorXY != undefined && Object.keys(message.act).length == 0) {
        effectRenderer.addEffect(
            new Effect(EFFECT_PROTOTYPE_MAP.ATTACK, null, stage, characterRenderer.cursorXY.x, characterRenderer.cursorXY.y));
      }
      for(var i=0; i<message.tokens.length; ++i) {
        //if(message.cursor.row == i)
        //  characterRenderer.setCursorPosition(characterRenderer.drawPosition);
        for(var j=0; j<message.tokens[i].length; ++j) {
          characterRenderer.addToken(message.tokens[i][j]);
        }
        characterRenderer.newLine();
      }
    }
  }

  function draw() {
    clear();
    characterRenderer.draw(stage);
    effectRenderer.draw(stage)
    renderer.render(stage);
  }

  function clear() {
    for(var i=stage.children.length-1; i>=0; --i) {
      stage.removeChild(stage.children[i], i);
    }
  }

}

KotCharacterRenderer = function(columns, rows) {

  var characterArray = new Array(),
      that = this,
      firstRow = 0,
      drawPosition = 0,
      changed = false,
      cursorPosition = 0;

  this.cursorXY = undefined;
  this.cursorDisplayObject = undefined;
  this.cursorTexture = PIXI.Texture.fromImage("/static/img/cursor.png");
  this.length = function() { return characterArray.length; }

  var that = this;

  function addCharacter(value, position, color) {
    value = new Character(value, color);

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
    var color = 'white';

    switch(token.kind) {
    case 'keyword':
      color = '#7F7FFF';
      break;
    case 'string':
      color = '#FF7F7F';
      break;
    case 'identifier':
      color = '#BFBF00';
      break;
    case 'comment':
      color = '#b0c4de'
      break;
    }

    for(var i=0; i<token.str.length; ++i) {
      addCharacter(token.str[i], drawPosition++, color);
    }
  }

  this.clear = function() {
    characterArray = new Array();
    drawPosition = 0;
    cursorPosition = 0;
    firstRow = 0;
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

    for(var i=getPositionOfFirstOfLine(firstRow); i<characterArray.length; ++i) {
      if(characterArray[i].value == '\n') {
        columnCount = 0;
        ++rowCount;
        continue;
      }

      if(cursorPosition == i) {
        that.cursorXY = { x: columnCount * 10, y: rowCount * 16 };

        cursorDisplayObject = new PIXI.Sprite(
            new PIXI.Texture(
                that.cursorTexture, new PIXI.Rectangle(that.cursorXY.x, that.cursorXY.y, 9, 16)
            )
        );

        stage.addChild(cursorDisplayObject);
      }

      characterArray[i].displayObject.position.x = columnCount * 9;
      characterArray[i].displayObject.position.y = rowCount * 16;

      stage.addChild(characterArray[i].displayObject);

      ++columnCount;

      if(columnCount > columns) {
        columnCount = 0;
        ++rowCount;
      }

      if(rowCount > rows) break;
      changed = false;
    }
  }

  this.setCursorPosition = function(position) {
    cursorPosition = position;
  }
}

Character = function(value, color) {

  this.value = value;
  var color = color;

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
      if(effectArray[i].isFinished()) removeEffect(i--);
    }
  }

  this.draw = function(stage) {
    for(var i=0; i<effectArray.length; ++i) {
      effectArray[i].draw(stage);
    }
  }

  function removeEffect(position) {
    //effectArray[position].clear();
    effectArray = (position < 0 || position > effectArray.length) ?
        effectArray : effectArray.slice(0, position).concat(effectArray.slice(position+1, effectArray.length));
  };

}

Effect = function(effectPrototype, value, stage, x, y) {

  var currentFrame = 0;

  var finished = false;
  var drawingObject;

  this.update = function() {
    currentFrame++;

    if(currentFrame > effectPrototype.frameLength) {
      finished = true;
      return;
    }

    if(effectPrototype.type == "func") {
      drawingObject = effectPrototype.update(currentFrame, value);
    } else if(effectPrototype.type == "image") {
      var texture = PIXI.Texture.
          fromImage("/static/img/nomal_attack" + currentFrame + ".png")
      drawingObject = new PIXI.Sprite(texture);
    }

  }

  this.draw = function() {
    if(effectPrototype.type == "func" && drawingObject != null)
      effectPrototype.draw(drawingObject, stage);
    else if(effectPrototype.type == "image")
      stage.addChild(drawingObject);
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

  ATTACK: {
    type: "image",
    frameLength: 5,
    header: "normal_attack",
  },

}