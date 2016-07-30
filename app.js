var five = require("johnny-five");
var Swipe = require('card-swipe');
var board = new five.Board();

console.log(Swipe);

var scanner = new Swipe.Scanner();
new Swipe({
    scanner : scanner,
    onSwipe : function(swipeData){
        console.log('Swipe successful! Data: '+swipeData);
    },
    onScan : function (scanData) {
        
    }
});
process.stdin.setRawMode();
process.stdin.resume();
process.stdin.on('data', function (chunk, key) {
    chunk = chunk.toString();
    for(var lcv=0; lcv < chunk.length; lcv++) scanner.input(chunk[lcv]);
    if (key && key.ctrl && key.name == 'c') process.exit();
});



board.on("ready", function() {
  // Create an Led on pin 13 and strobe it on/off
  var led = new five.Led(13)
  // Optionally set the speed; defaults to 100ms
  led.strobe(100);
  
});