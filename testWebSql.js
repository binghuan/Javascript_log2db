

$('document').ready(function() {
	console.info("ui is ready !!");
	$('#tryLogMsg').click(function() {
		console.info('ready to log text:' + document.getElementById('buttonLogMsg').value);
		log2db.log.d(document.getElementById('buttonLogMsg').value);
	});

	$('#dumpLog').click(function() {
		console.info('ready to dump log');
		log2db.dumpDataFromTable(loadAllLogText);
	});
});

var db ;

function createDBandTable() {

		try {
			if (!window.openDatabase) {
			alert('not supported');
			} else {
				var shortName = 'mydatabase';
		      var version = '1.0';
		      var displayName = 'My Important Database';
		      var maxSize = 65536; // in bytes
		      db = openDatabase(shortName, version, displayName, maxSize);
		      createTables(db);
		      // You should have a database instance in db.
			}
		} catch(e) {
			      // Error handling code goes here.
			      if (e == 2) {
			          // Version number mismatch.
			          console.error("Invalid database version.");
			      } else {
			          console.error("Unknown error "+e+".");
			      }

				return; 
		}

}

// function to dump log to file.
function loadAllLogText(transaction, result) {

	var bb = new BlobBuilder();
	console.log('+ loadAllLogText');
	var rowOutput = "";
        var todoItems = document.getElementById("todoItems");

        console.log("loadAllLogText -- start");

        for (var i=0; i < result.rows.length; i++) {
          console.log(result.rows.item(i).message);
          bb.append(result.rows.item(i).message + "\n");
        }
	console.log("loadAllLogText -- end");
	var blob = bb.getBlob("text/plain;charset=" + document.characterSet);
	saveAs( blob, "log.txt");
}

function getAllLogs(extractFunc) {
	console.log('+ getAllLogs');

	log2db.dumpDataFromTable(extractFunc);
}

function createTables(db) {
	db.transaction(
	function (transaction) {
		dbTransaction = transaction;
		//create table if not exists TableName (col1 typ1, ..., colN typN)
              /* The first query causes the transaction to (intentionally) fail if the table exists. */
		transaction.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(message TEXT);', [], nullDataHandler, errorHandler);
	              /* These insertions will be skipped if the table already exists. */
		//transaction.executeSql('insert into people (name, shirt) VALUES ("Joe", "Green");', [], nullDataHandler, errorHandler);
		//transaction.executeSql('insert into ' + tableName + ' (message) VALUES ("This is fire line log");', [], nullDataHandler, errorHandler);

	} );
}

var sqlString = "";
var tableName = "logTable";
function log2Database(msg) {
	sqlString = 'insert into logTable (message) VALUES ("' + msg + '");'

	db.transaction( function (transaction) {
		transaction.executeSql(sqlString, [], nullDataHandler, errorHandler);
	});
}

function errorHandler(transaction, error)
  {
      // error.message is a human-readable string.
      // error.code is a numeric error code
      alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
      // Handle errors here
      var we_think_this_error_is_fatal = true;
      if (we_think_this_error_is_fatal) return true;
      return false;
}

function nullDataHandler(transaction, results) { 

}


//createDBandTable();	
//console.log("Database is: "+db);
console.log("setp 1");
log2db.openDB("db2");
console.log("setp 2");
log2db.createTable("table2");
console.log("setp 3");
