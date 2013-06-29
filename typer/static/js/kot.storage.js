KotStorage = function(){
  var row = 0, col = 0, max_col = -1;
  var storage = [""];
  var engine;

  function newLine() {
    var line = storage[row];
    var line1 = line.slice(0, col);
    var line2 = line.slice(col);

    storage[row] = line1;
    storage.splice(row+1,0,line2);
    row = row + 1;
    col = 0;
    max_col = -1;
  }

  function putChar(charData){
    var line = storage[row];
    var line1 = line.slice(0, col);
    var line2 = line.slice(col);
    storage[row] = line1 + charData + line2;
    col= col + 1;
    max_col = -1;
  }

  function rmChar() {
    var line = storage[row];
    var line1 = line.slice(0, col-1);
    var line2 = line.slice(col);
    storage[row] = line1 + line2;
    col = col - 1;
    max_col = -1;
  }

  function mergeLine() {
    if(row==0) return;
    var line1 = storage[row-1];
    var line2 = storage[row];
    var line = line1.concat(line2);
    storage.splice(row-1,2,line);
    row = row - 1;
    col = line1.length;
    max_col = -1;
  }

  this.putCmd = function(code) {
    switch(code) {
    case 13:
      newLine();
      break;
    case  8: // BACK SPACE
      if (0 < col) {
        rmChar();
      } else if(0 < row) {
        mergeLine();
      }
      break;
    case 46: // DELETE
      if(col < storage[row].length) {
        col = col + 1;
        rmChar();
      } else if(row < storage.length-1) {
        row = row + 1;
        col = 0;
        mergeLine();
      }
      break;
    case 33: // PAGE UP
      break;
    case 34: // PAGE DOWN
      break;
    case 35: // END
      col = storage[row].length;
      max_col = -1;
      break;
    case 36: // HOME
      col = 0;
      max_col = -1;
      break;
    case 37: // LEFT
      if(col > 0) col = col - 1;
      max_col = -1;
      break;
    case 38: // UP
      if(row >0) row = row - 1;
      if(max_col!=-1) col = max_col;
      if(col > storage[row].length) {
        max_col = col;
        col = storage[row].length;
      }
      break;
    case 39: // RIGHT
      if(col < storage[row].length) col = col + 1;
      max_col = -1;
      break;
    case 40: // DOWN
      if(row < storage.length-1) row = row + 1;
      if(max_col!=-1) col = max_col;
      if(col > storage[row].length) {
        max_col = col;
        col = storage[row].length;
      }
      break;
    }
    if(engine != undefined) engine.putSource(storage, {cursor: {col: col, row: row}, code: code});
  };
  this.putChar = function(code) {
    putChar(String.fromCharCode(code));
    if(engine != undefined) engine.putSource(
                              storage,
                              {cursor: {col: col, row: row},
                               code: code}
                            );
  }

  this.setEngine = function(e) {
    engine = e;
  }

  this.setCurser = function(row, col) {
  }

  this.getText = function() {
  }

  this.dump = function() {
    console.log("row : "+row);
    console.log("col : "+col);
    for(i in storage) {
      console.log(storage[i]);
    }
  }
}

