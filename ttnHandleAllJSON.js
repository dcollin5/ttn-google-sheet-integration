//This Google Sheets Apps Script implementation allows your script to handle any JSON parameters without needing manual updates to accommodate new fields.
//1. It dynamically creates the headers in the spreadsheet based on the keys present in the JSON data.
//2. It extracts data from the JSON object dynamically, without explicitly specifying each parameter. This can be useful if all LoRaWAN parameters are required. 
//3. It appends the extracted data along with the date and time values to the spreadsheet.
//Note, if using non TTN LoRaWAN parameters, its necessary to define the sheet name: e.g., var sheet = doc.getSheetByName(devEui);

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

//ttn uses doPost function
function doPost(e){
 return handleResponseAllJSON(e);
}


function currentTime(){
 // Create a new Date object
 var currentTime = new Date();


 // Get the current hour, minute, and second
 var currentHour = currentTime.getHours();
 var currentMinute = currentTime.getMinutes();
 var currentSecond = currentTime.getSeconds();


 // Format the time nicely
 var formattedTime = currentHour + ":" + currentMinute + ":" + currentSecond;


 // Display the current time
 console.log("The current time is: " + formattedTime);
  return formattedTime;
}


function dateTime() {
 var currentdate = new Date();
 var datetime = "Last Sync: " + currentdate.getDate() + "/"
               + (currentdate.getMonth()+1)  + "/"
               + currentdate.getFullYear() + " @ " 
               + currentdate.getHours() + ":" 
               + currentdate.getMinutes() + ":"
               + currentdate.getSeconds();
 return currentdate;
}

function handleResponseAllJSON(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000); // wait 30 seconds before conceding defeat.
  
  try {
    var jsonData = flatten(JSON.parse(e.postData.contents));
    var devEui = jsonData.dev_eui;

    // Create or open sheet based on dev_eui
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(devEui);
    if (!sheet) {
      sheet = doc.insertSheet(devEui);
      // Set headers if the sheet is newly created
      sheet.appendRow(Object.keys(jsonData)); // Set headers dynamically based on JSON keys
    }
    
    var nextRow = sheet.getLastRow() + 1; // get next row

    // Extract data from JSON object
    var rowData = Object.keys(jsonData).map(function(key) {
      return jsonData[key];
    });

    // Append data to the next empty row in the spreadsheet
    sheet.appendRow(rowData.concat(dateTime(), currentTime()));
    
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    // if error return this
    console.error(e);
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function flatten(obj) {
 var flattened = {};
 Object.keys(obj).forEach(function(key) {
   if (typeof obj[key] === 'object' && obj[key] !== null) {
     Object.assign(flattened, flatten(obj[key]));
   } else {
     flattened[key] = obj[key];
   }
 });
 return flattened;
}
