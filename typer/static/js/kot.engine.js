var KotEngine = function() {
  this.tokenList = [];
  this.lexer = new KotLexer('python');
  this.eventCallback = function() {};
  this.nextId = 0;
  this.code = -1;
};

KotEngine.prototype = {
  idGen: function() {
    return this.nextId++;
  },
  initSource: function(source) {
    result = []
    for(i in source) {
      line = source[i]
      tmp = []
      for(j in line) {
        token = line[j]
        console.log(token)
        tmp.push({
          'kind': token.kind,
          'str': token.str,
          'id': this.idGen()
        })
      }
      result.push(tmp)
    }
    return result
  },
  diffSource: function(newToken) {
    function isSameLine(a, b) {
      minTokenLength = Math.min(a.length, b.length)
      for(var j = 0; j < minTokenLength; j++) {
        if(a[j].kind != b[j].kind || a[j].str != b[j].str) {
          return j
        } else {
          a[j]['id'] = b[j]['id']
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
        newToken[line][token]['id'] = this.idGen()
        break
      }
    }
    return {'row': line, 'token': token};
  },
  getSameToken: function(newToken, after) {
    function isSameToken(newOne, oldOne) {
      minTokenLength = Math.min(newOne.length, oldOne.length)
      for(j=after['token'] + 1; j < minTokenLength; j++) {
        for(k=after['token'] + 1; k < minTokenLength; k++) {
          if(newOne[j].kind == oldOne[k].kind && newOne[j].str == oldOne[k].str) {
            return [k, j]
          }
        }
      }

      return -1
    }
    var line = 0;
    var token = 0;
    var old = -1;
    var lineDiff = -1;
    var minLineLength = Math.min(newToken.length, this.tokenList.length)
    for(var i=after['row']; i < minLineLength; i++) {
      lineDiff = isSameToken(newToken[i], this.tokenList[i]);
      if(lineDiff != -1) {
        line = i;
        token = lineDiff[1];
        old = lineDiff[0]
        break
      }
    }

    return {'row': line, 'token': token, 'old': old};
  },
  inheritId: function(newToken, bef, after) {
    while(after['token'] < newToken[bef['row']].length) {
      if(after['old'] == -1) {
        newToken[bef['row']][after['token']]['id'] = this.idGen()
      } else if(this.tokenList[bef['row']].length <= after['old']) {
        newToken[bef['row']][after['token']]['id'] = this.idGen()
      } else {
        newToken[bef['row']][after['token']]['id'] = this.tokenList[bef['row']][after['old']]['id'];
      }
      /*
      if((this.code == 46 || this.code == 8) && newToken[bef['row']][after['token']].length == 0) { 
        this.acts.push({
          'id': newToken[bef['row']][after['token']]['id'],
          'act': 'delete'
        })
      } else {
        var act = ""
        switch(newToken[bef['row']][after['token']]['kind']) {
          case "keyword": act = "new"
          case "special": act = "new"
          case "number": act = "newNumber"
        }
        this.acts.push({
          'id': newToken[bef['row']][after['token']]['id'],
          'act': act
        })
      }
      */
      after['old'] = ++after['old'];
      after['token'] = ++after['token'];
    }
  },
  putSource: function(source, opts) {
    this.acts = []
    this.code = opts['code']
    var newTokenList = this.lexer.tokenize(source);
    console.log(newTokenList)

    if(this.tokenList.length == 0) {
      this.tokenList = this.initSource(newTokenList)
    } else {
      diffPoint = this.diffSource(newTokenList)
      samePoint = this.getSameToken(newTokenList, after=diffPoint)
      this.inheritId(newTokenList, diffPoint, samePoint)
      this.tokenList = newTokenList
    }
    // call renderer
    console.log("act >",this.acts)
    this.eventCallback({
      "tokens": this.tokenList,
      "act": this.acts,
      "cursor": opts['cursor']
    }); 
  },
  setEventCallback: function(callback) {
    this.eventCallback = callback;
  }
}
