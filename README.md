# Javascript_log2db

A JavaScript library for recording log messages into web databases with support for both IndexedDB and WebSQL.

## Features

- **Dual Database Support**: Automatically detects and uses IndexedDB (preferred) or WebSQL as fallback
- **Simple Logging API**: Easy-to-use logging interface with timestamp support
- **Export Functionality**: Export logged messages to text files
- **Database Management**: Create, delete, and manage database operations
- **Cross-browser Compatibility**: Works with browsers supporting either IndexedDB or WebSQL

## Browser Support

- **IndexedDB**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **WebSQL**: Legacy browser support (deprecated but still functional in some browsers)

## Quick Start

### 1. Include Required Files

```html
<!DOCTYPE html>
<html>
<head>
    <!-- jQuery (required) -->
    <script src="jquery-1.10.1.min.js"></script>
    
    <!-- File export functionality -->
    <script src="Blob.js"></script>
    <script src="BlobBuilder.js"></script>
    <script src="FileSaver.js"></script>
    
    <!-- Core library -->
    <script src="log2db.js"></script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### 2. Initialize Database

```javascript
// Open/create database
log2db.openDatabase("myLogDatabase");
```

### 3. Log Messages

```javascript
// Log a debug message with timestamp
log2db.log.d("This is a debug message");
log2db.log.d("Application started successfully");
log2db.log.d("User clicked button X");
```

## API Reference

### `log2db.openDatabase(dbName)`
Opens or creates a database with the specified name.

**Parameters:**
- `dbName` (string): Name of the database to open/create

**Example:**
```javascript
log2db.openDatabase("applicationLogs");
```

### `log2db.log.d(message)`
Logs a debug message with automatic timestamp.

**Parameters:**
- `message` (string): The message to log

**Example:**
```javascript
log2db.log.d("User authentication successful");
```

### `log2db.dumpDataFromTable(callbackFunc, tableName)`
Retrieves all logged data from the database.

**Parameters:**
- `callbackFunc` (function): Callback function to handle the retrieved data
- `tableName` (string, optional): Specific table name (uses default if not provided)

**Example:**
```javascript
log2db.dumpDataFromTable(function(transaction, result) {
    // Process the logged data
    for (var i = 0; i < result.rows.length; i++) {
        console.log(result.rows.item(i).message);
    }
});
```

### `log2db.deleteDatabase(dbName)`
Deletes the specified database.

**Parameters:**
- `dbName` (string): Name of the database to delete

**Example:**
```javascript
log2db.deleteDatabase("applicationLogs");
```

## Database Schema

### IndexedDB Structure
- **Object Store**: `logTable`
- **Key Path**: `timestamp`
- **Index**: `text` (on message content)

### WebSQL Structure
- **Table**: `logTable`
- **Columns**:
  - `timestamp` (TEXT): ISO timestamp string
  - `message` (TEXT): Log message content

## File Export Feature

The library includes functionality to export logged messages to a text file:

```javascript
// Export all logs to a downloadable text file
function exportLogs() {
    log2db.dumpDataFromTable(function(transaction, result) {
        var bb = new BlobBuilder();
        for (var i = 0; i < result.rows.length; i++) {
            bb.append(result.rows.item(i).message + "\n");
        }
        var blob = bb.getBlob("text/plain;charset=" + document.characterSet);
        saveAs(blob, "application_logs.txt");
    });
}
```

## Example Implementation

See `testWebSql.html` and `testWebSql.js` for a complete working example with:
- Message input and logging
- Data export functionality
- Database deletion

## Dependencies

- **jQuery**: Required for DOM manipulation and event handling
- **Blob.js**: Cross-browser Blob support
- **BlobBuilder.js**: Cross-browser BlobBuilder support  
- **FileSaver.js**: File download functionality

## Browser Compatibility Notes

- **IndexedDB**: Preferred storage method for modern browsers
- **WebSQL**: Fallback for older browsers (deprecated specification)
- **File Export**: Requires modern browser support for Blob and FileSaver APIs

## Version History

- **20130721**: Added support for both IndexedDB and WebSQL databases
- **Initial Release**: Basic WebSQL logging functionality

## Alternative Solutions

For more advanced local storage needs, consider:
- [localForage](https://github.com/mozilla/localForage) - Offline storage with automatic fallback
