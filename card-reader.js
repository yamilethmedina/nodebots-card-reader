var stdin = process.stdin;
var jsonfile = require('jsonfile');
var file = "records/data.json";
var arduino = require('./board.js');


console.log("WELCOME TO MOONLIGHTER MAKERSPACE!");
console.log("CARD READER APP INITIATED: ");

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

function parseMemberKey(key) {
	// regex
	
	var cleanKey = key.replace(/[^0-9]/g, "");
	
	if (parseInt(cleanKey) !== NaN) {
		return cleanKey; // 000
	} else {
		return;
	}
};


function addRecord (memberId) {
	// var fs = require('fs');
	// var path = __dirname + "/records/data.json";
	
	jsonfile.readFile(file, function(err, db) {
	
		var record = {
			"member" 	  : memberId,
			"timeStamp"   : new Date(),
			"status"      : 1
		};
		
		if(db.data.length > 1 ) {
			for(i=0; i < db.data.length; i++) {
				
				
				if(db.data[i].member == record.member) {
					if(db.data[i].status == 1) {
						
						
						db.data[i].status = 0;
						jsonfile.writeFile(file, db, function(err) {
							if(err) {console.log(err);}
						});
						console.log("Updated status to 0");
						arduino();

					} else {
						db.data[i].status = 1;
						jsonfile.writeFile(file, db, function(err) {
							if(err) {console.log(err);}
						});
						console.log("Updated status to 1");
						arduino();

					} 
				} else if(db.data.length < 1 ) {
						db.data.push(record);
						jsonfile.writeFile(file, db, function(err) {
							if(err) {console.log(err);}
						});
						console.log("Created a new record.");
						arduino();

					}
			}
		} else { 
			
			db.data.push(record);
						jsonfile.writeFile(file, db, function(err) {
							if(err) {console.log(err);}
						});
						 console.log("Created a new record.");
						 arduino();

		} 
		
		
	});
	
	
	
	
	
};

(function () {
	
	var memberArray = ["A"]; // [";", "0", "0", etc...]
	
	// on any data into stdin
	stdin.on('data', function (key) {
		
		memberArray.push(key);
		//console.log(memberArray);
		var memberId = parseMemberKey(memberArray.join("")); // 000
		//console.warn(memberId);
		
		// ctrl-c ( end of text )
		if (memberId.length === 6) {
			console.log("Member ID: " + memberId);
			addRecord(memberId);
			memberArray = [];
		}
		// write the key to stdout all normal like
		// process.stdout.write( key );
		
		//console.log("THIS IS THE KEY:", key);
	  
	});
})();
