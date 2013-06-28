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
        "\\s+": function(text) {
          return that.tokenForm('whitespace', text);
        },
        '[a-zA-Z_][a-zA-Z0-9_]*': function(text) {
          return that.tokenForm('identifier', text);
        },
        '\\(|\\)|\\[|\\]|\\{|\\}': function(text) {
          return that.tokenForm('parenthese', text);
        },
        '\\:': function(text) {
          return that.tokenForm('colon', text);
        },
        ',': function(text) {
          return that.tokenForm('comma', text);
        },
        '=': function(text) {
          return that.tokenForm('equal', text);
        },
        '\\\\': function(text) {
          return that.tokenForm('linebreak', text);
        }

      } 
    };
    return ruleList[k];
  },
  tokenize: function(t) {
    var res = [];
    var statement = "";
    for(i in t) {
      var tmp = [];
      l = new Lexed(t[i], this.rules(this.rulesKind))
      var token;
      while ((token = l.lex()) != Lexed.EOF) {
        if(token.kind == "comment" && (token.str == '"""' || token.str == "'''")) {
          if(statement.length == 0) {
            statement = "comment";
          } else {
            statement = "";
          }
        }
        if(statement.length == 0) {
          tmp.push(token);
        } else {
          token.kind = statement;
          tmp.push(token);
        }
      }
      res.push(tmp);
    }
    return res
  }
}
