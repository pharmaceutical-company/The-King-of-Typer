var KotEngine = function() {
  this.tokenList = [];
  this.lexer = new KotLexer('python');
  this.eventCallback = function() {};
  this.nextId = 0;
};

KotEngine.prototype = {
  idGen: function() {
    return this.nextId++;
  },
  initSource: function(source) {
    for(i in source) {
      line = source[i]
      for(j in line) {
        token = line[j]
        console.log(token)
        this.tokenList.push({
          'kind': token.kind,
          'str': token.str,
          'id': this.idGen()
        })
      }
    }
  },
  diffSource: function(newToken) {
    function isSameLine(a, b) {
      minTokenLength = Math.min(a.length, b.length)
      for(var j = 0; j < minTokenLength; j++) {
        if(a[j].kind != b[j].kind || a[j].str != b[j].str) {
          return j
        }
      }
      return -1
    }
    var line = 0;
    var token = 0;
    var minLineLength = Math.min(newToken.length, this.tokenList.length)
    for(var i=0; i < minLineLength; i++) {
      lineDiff = isSameLine(newToken[i], this.tokenList[i]);
      if(lineDiff != -1) {
        line = i;
        token = lineDiff;
      }
    }
    return {'row': line, 'token': token};
  },
  putSource: function(source) {
    var newTokenList = this.lexer.tokenize(source); 

    if(this.tokenList.length == 0) {
      this.tokenList = newTokenList;
    } else {
      diffPoint = this.diffSource(newTokenList)
      console.log(diffPoint)
    }
  },
  setEventCallback: function(callback) {
    eventCallback = callback;
  }
}
