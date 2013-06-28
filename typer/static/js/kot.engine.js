var KotEngine = function() {
  var tokenList = [];
  var lexer = new KotLexer('python');
  var eventCallback = function() {};

  var nextId = 0;
  function idGen() {
    return nextId++;
  }

  this.putSource = function(source) {
    var newTokenList = lexer.tokenize(source);
    function checkSameToken(a, b) {
      if((a.kine==b.kine)&&(a.str==b.str)){
        return true;
      }
      return false;
    }
    var breakFlag = false;
    var lines = Math.min(tokenList.length, newTokenList.length);
    for(var i=0; i<lines&&!breakFlag; i++) {
      var tokens = Math.min(tokenList[i].length, newTokenList[i].length);
      for(var j=0; j<tokens&&!breakFlag; j++) {
        if(!checkSameToken(tokenList[i][j], newTokenList[i][j])) {
          breakFlag = true;
          break;
        }
        newTokenList[i][j].id = tokenList[i][j].id;
        delete tokenList[i][j].id;
      }
    }
    breakFlag = false;
    for(var ie=1; ie<=lines&&!breakFlag; ie++) {
      var line = tokenList[tokenList.length-ie];
      var newLine = newTokenList[newTokenList.length-ie];
      var tokens = Math.min(line.length, newLine.length);
      for(var je=1; je<=tokens&&!breakFlag; je++) {
        var token = line[line.length-je];
        var newToken = newLine[newLine.length-je];
        if(!checkSameToken(token, newToken)) {
          breakFlag = true;
          break;
        }
        newToken.id = token.id;
        delete token.id;
      }
    }
  };

  this.setEventCallback = function(callback) {
    eventCallback = callback;
  };
};
