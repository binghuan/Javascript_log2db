
var databaseName = "logDatabase";


$('document').ready(function() {
	console.info("ui is ready !!");
	$('#tryLogMsg').click(function() {
		console.log('ready to log text:' + document.getElementById('buttonLogMsg').value);
		log2db.log.d(document.getElementById('buttonLogMsg').value);
	});

	$('#dumpLog').click(function() {
		console.log('ready to dump log');
		log2db.dumpDataFromTable(loadAllLogText);
	});

	$('#deleteDB').click(function() {
		console.log('ready to delete logDatabase');
		log2db.deleteDatabase(databaseName);
	});
});




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

console.log("setp 1");
log2db.openDatabase("logDatabase");
