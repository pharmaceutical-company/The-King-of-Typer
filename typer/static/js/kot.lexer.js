function KotLexer(k) {
  this.rulesKind = k;
}

KotLexer.prototype =  {
  tokenForm: function(kind, str) {
    return {'kind': kind, 'str': str};
  },
  rules: function(k) {
    that = this
    ruleList = {
      'python': {
        '#.*$': function(text) {
          return that.tokenForm('comment', text)
        },
        'and|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|yield|while': function(text) {
          return that.tokenForm('keyword', text);
        },
        'None|True|False|self|cls': function(text) {
          return that.tokenForm('special', text);
        },
        "(['\"]{3})([^\\1])*?\\1": function(text) {
          return that.tokenForm('comment', text);
        },
        '"(?!")(?:\\.|\\\\\\"|[^\\""\\n\\r])*"': function(text) {
          return that.tokenForm('string', text);
        },
        "'(?!')(?:\\.|(\\\\\\')|[^\\''\\n\\r])*'": function(text) {
          return that.tokenForm('string', text);
        },
        "\\b\\d+\\.?\\w*": function(text) {
          return that.tokenForm('number', text);
        },
        "\\s": function(text) {
          return that.tokenForm('whitespace', text);
        },
        '[a-zA-Z_][a-zA-Z0-9_]*': function(text) {
          return that.tokenForm('identifier', text);
        }
      } 
    };
    return ruleList[k];
  },
  tokenize: function(t) {
    var res = []
    for(i in t) {
      var tmp = [];
      l = new Lexed(t[i], this.rules(this.rulesKind))
      var token;
      while ((token = l.lex()) != Lexed.EOF) {
        tmp.push(token);
      }
      res.push(tmp);
    }
    return res
  }
}
