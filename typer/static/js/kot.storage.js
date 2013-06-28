KotStorage = function(){
  var row = 0, col = 0;
  var storage = [""];

  function newLine() {
    var line = storage[row];
    var line1 = line.slice(0, col);
    var line2 = line.slice(col);

    storage[row] = line1;
    storage.splice(row+1,0,line2);
    row = row + 1;
    col = 0;
  }

  function putChar(charData){
    var line = storage[row];
    var line1 = line.slice(0, col);
    var line2 = line.slice(col);
    storage[row] = line1 + charData + line2;
    col= col + 1;
  }

  this.putchar = function(code) {
    console.log(code)
    if(code == 13) {
      newLine();
    } else if(33<=code && code<=40) {
      switch(code) {
      case 33: // PAGE UP
        break;
      case 34: // PAGE DOWN
        break;
      case 35: // END
        col = storage[row].length;
        break;
      case 36: // HOME
        col = 0;
        break;
      case 37: // LEFT
        if(col > 0) col = col - 1;
        break;
      case 38: // UP
        if(row >0) row = row - 1;
        if(col > storage[row].length) col = storage[row].length;
        break;
      case 39: // RIGHT
        if(col < storage[row].length) col = col + 1;
        break;
      case 40: // DOWN
        if(row < storage.length-1) row = row + 1;
        if(col > storage[row].length) col = storage[row].length;
        break;
      }
    } else {
      putChar(String.fromCharCode(code));
    }
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

