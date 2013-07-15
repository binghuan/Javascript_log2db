var log2db = (function() {

	if(!window.openDatabase) {
		console.warn("Orz: Not Support Web Sql Database !!");
		return;
	}

	var sqlString = "";
	var table ;
	var db;

	var nullDataHandler = function(transaction, results) { 
	};

	var errorHandler = function(transaction, error) {
		console.error('Oops.  Error was '+error.message+' (Code '+error.code+')');
	};

	var inserMsg2db = function(msg) {
		sqlString = 'insert into ' + table + ' (message) VALUES ("' + msg + '");';
		db.transaction( function (transaction) {
			transaction.executeSql(sqlString, [], nullDataHandler, errorHandler);
		});
	};

	return {
		dumpDataFromTable: function(callbackFunc, tableName) {
			console.log('+ getAllLogs');
			db.transaction(function(transaction) {
				if(tableName) {
					transaction.executeSql('SELECT * FROM ' + tableName, [], callbackFunc, errorHandler);	
				} else {
					transaction.executeSql('SELECT * FROM ' + table, [], callbackFunc, errorHandler);	
				}
			});
		},
		log: {
			d: function(text) {
				logText = (new Date()) + " - " + text;
				console.debug(logText);
				inserMsg2db(logText);
			}
		},
		createTable: function(tableName) {
			console.log("+ createTable");
			db.transaction(function (transaction) {
				transaction.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(message TEXT);', [], nullDataHandler, errorHandler);
				console.log("- createTable");
				table = tableName;
			} );
		},
		openDB: function(dbName) {
			console.log("+ openDB");
			try {
				if (!window.openDatabase) {
					console.warn('webSqlDB is not supported');
				} else {
					var shortName = dbName;
					var version = '1.0';
					var displayName = 'My Important Database';
					var maxSize = 65536; // in bytes
					console.log("+ openDatabase");
					db = openDatabase(shortName, version, displayName, maxSize);
					console.log("- openDatabase");
				}
			} catch(e) {
				// Error handling code goes here.
				if (e == 2) {
					// Version number mismatch.
					console.error("Invalid database version.");
				} else {
					//console.error("Unknown error: "+e+".");
					console.error("Unknown error");
				}

				return; 
			}

			console.log("- openDB");
		}		
	};
})();