var log2db = (function() {

	if(!(window.openDatabase || window.indexedDB)) {
		console.warn("both WebSqlDb and IndexedDB are not supported !!");
		return;
	}

	var DEF_DB_VERSION = 1;
	var DEF_TABLE = "logTable";
	var DEF_STORE_NAME = DEF_TABLE;

	var sqlString = "";
	var table ;
	var webDb;
	var request ;
	var requestOpenIndexedDB;

	var store;
	var timeStampString ;
	var logText ;

	var sqlDbNullDataHandler = function(transaction, results) {
		console.log(results);
	};

	var sqlDbErrorHandler = function(transaction, error) {
		console.error('Oops.  Error was '+error.message+' (Code '+error.code+')');
	};

	var logObj = {};

	var addMsg2db = function(timeStamp, msg) {
		
		if (window.indexedDB) {
			store = getObjectStore(DEF_STORE_NAME, 'readwrite');

			logObj.timestamp = timeStamp;
			logObj.text =  msg;
			console.log("ready to log:");
			console.log(logObj);
			try {
				request = store.add(logObj);	

				request.onsuccess = function (evt) {
				console.log("Insertion in DB successful");
				};
				request.onerror = function(evt) {
					console.error("addLog error", this.error, evt);
				};

				

			} catch (e) {
				console.error("logMsg error : ", e);
			}
			
		} else if(window.openDatabase) {
			sqlString = 'insert into ' + table + ' (timestamp, message) VALUES ("' + timeStamp + '", "' + msg + '");';
			webDb.transaction(function(transaction){
				transaction.executeSql(sqlString, [], sqlDbNullDataHandler, sqlDbErrorHandler);
			});
		}
	};
	
	var createTable = function(tableName) {
			console.log("+ createTable");
			webDb.transaction(function (transaction) {
				//transaction.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(timestamp TEXT, message TEXT);', [], sqlDbNullDataHandler, sqlDbErrorHandler);
				transaction.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(timestamp TEXT, message TEXT);', [], sqlDbNullDataHandler, sqlDbErrorHandler);
				console.log("- createTable");
				table = tableName;
			} );
	};

	var getObjectStore = function(storeName, mode) {
		console.log("+ getObjectStore: ", storeName, mode);
		var tx = webDb.transaction([storeName], mode);
		return tx.objectStore(storeName);
	};

	return {

		dumpDataFromTable: function(callbackFunc, tableName) {
			console.log('+ getAllLogs');
			if(window.indexedDB) {
				
				store = getObjectStore(DEF_STORE_NAME, "readwrite");

				request = store.count();
				request.onsuccess = function (evt){
					//alert("total data count:" + evt.target.result);
					console.log("total data count:" + evt.target.result);
				};

				var i=0;
				request = store.openCursor();
				var resultString = "";
				request.onsuccess = function(evt) {
					var cursor = evt.target.result;
					if (cursor) {
						console.log("displayDataList cursor:", cursor);
						request = store.get(cursor.key);
						request.onsuccess = function (evt) {
							var value = evt.target.result;
							console.log(value);
						};
						
						cursor.continue();
					} else {
						console.log(resultString);
					}
				};

			} else if (window.openDatabase) {
				webDb.transaction(function(transaction) {
					if(tableName) {
						transaction.executeSql('SELECT * FROM ' + tableName, [], callbackFunc, sqlDbErrorHandler);	
					} else {
						transaction.executeSql('SELECT * FROM ' + table, [], callbackFunc, sqlDbErrorHandler);	
					}
				});
			}
		},
		log: {
			d: function(text) {
				timeStampString = (new Date());
				logText = text;
				console.debug(timeStampString, logText);
				addMsg2db(timeStampString, logText);
			}
		},
		deleteDatabase: function(dbName) {
			if(window.indexedDB) {
				indexedDB.deleteDatabase(dbName);
				console.log(">>> deleteDatabase: ", dbName);
			} else if (window.openDatabase){
				console.log("There is no way to delete the target database: ", dbName);
				// reference: http://stackoverflow.com/questions/7183049/how-to-delete-a-database-in-web-sql

				// try to droptable
				webDb.transaction(function(transaction) {
					transaction.executeSql('DROP TABLE ' + DEF_TABLE);	
				});
			}
		},
		openDatabase: function(dbName) {
			console.log("+ openDatabase");
			
				if (window.indexedDB) {
					console.log("* indexedDB is in using !!");
					var req = indexedDB.open(dbName, DEF_DB_VERSION);
					req.onsuccess = function (evt) {
						// Better use "this" than "req" to get the result to avoid problems with
						// garbage collection.
						// db = req.result;
						webDb = this.result;
						console.log("success: open indexedDB");
					};
					req.onerror = function (evt) {
						console.error("error: openDb - ", evt.target.errorCode);
					};

					req.onupgradeneeded = function (evt) {
						console.log("openDb.onupgradeneeded");
						store = evt.currentTarget.result.createObjectStore(DEF_STORE_NAME, { keyPath: 'timestamp'});
						store.createIndex('text', 'text', { unique: false });
					};

				} else if (window.openDatabase) {
					console.log("* sqlDB is in using !!");
					var shortName = dbName;
					var version = '1.0';
					var displayName = 'My Important Database';
					var maxSize = 65536; // in bytes
					console.log("+ openDatabase");
					try {
						webDb = openDatabase(shortName, version, displayName, maxSize);
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
					console.log("- openDatabase");
					
					createTable(DEF_TABLE);

				} else {
					console.warn("both sqlDb and indexedDB are not supported.");
				}
				
			

			console.log("- openDB");
		}		
	};
})();