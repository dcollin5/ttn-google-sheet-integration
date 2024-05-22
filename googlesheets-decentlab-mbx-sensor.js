// Create or open an existing Sheet and click Tools > Script editor and enter the code below
// 1. Run > setup
// 2. Publish > Deploy as web app
//    - enter Project Version name and click 'Save New Version'
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)
// 3. Copy the 'Current web app URL' and post this in your form/script action in the Things Network


var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service


// If you don't want to expose either GET or POST methods you can comment out the appropriate function
//function doGet(e){
//  return handleResponseV2(e);
//}


//ttn uses doPost function
function doPost(e){
 return handleResponseV2(e);
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


function currentDateUSA() {
 // Create a new Date object
 var currentTime = new Date();


 // Get the current month, day, and year
 var currentMonth = currentTime.getMonth() + 1; // Add 1 because getMonth() returns zero-based values
 var currentDay = currentTime.getDate();
 var currentYear = currentTime.getFullYear();




 // Format the date
 var formattedDate = currentMonth + '/' + currentDay + '/' + currentYear;
  return formattedDate;
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


function handleResponseV2(e) {
 var lock = LockService.getPublicLock();
 lock.waitLock(30000); // wait 30 seconds before conceding defeat.
  try {
   //enable the following line for testing.
   //var jsonData = flatten(json_data);
   var jsonData = JSON.parse(e.postData.contents);


   //var jsonData = json_data;
   var devEui = jsonData.end_device_ids.dev_eui;
 
   // Create or open sheet based on dev_eui
   var doc = SpreadsheetApp.getActiveSpreadsheet();
   var sheet = doc.getSheetByName(devEui);
   if (!sheet) {
     sheet = doc.insertSheet(devEui);
     // Set headers if the sheet is newly created
     sheet.appendRow(['dev_eui', 'battery_voltage', 'device_id', 'distance(mm)', 'number_of_valid_samples', 'date_time', 'current_time', 'usa_date']);
   }
  
   var nextRow = sheet.getLastRow() + 1; // get next row


   // Extract data from JSON object
   var rowData = [
     jsonData.end_device_ids.dev_eui,
     jsonData.uplink_message.decoded_payload.battery_voltage.value,
     jsonData.uplink_message.decoded_payload.device_id,
     jsonData.uplink_message.decoded_payload.distance.value,
     jsonData.uplink_message.decoded_payload.number_of_valid_samples.value,
     dateTime(),
     currentTime(),
     currentDateUSA(),
     // Add more parameters as needed
   ];


   // Append data to the next empty row in the spreadsheet
   sheet.appendRow(rowData);
  
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




function handleResponseV3(e) {
 var lock = LockService.getPublicLock();
 lock.waitLock(30000); // wait 30 seconds before conceding defeat.
  try {
   var jsonData = JSON.parse(e.postData.contents);
   var devEui = jsonData.dev_eui; // Assuming devEui is static for this example


   // Create or open sheet based on devEui
   var doc = SpreadsheetApp.getActiveSpreadsheet();
   var sheet = doc.getSheetByName(devEui);
   if (!sheet) {
     sheet = doc.insertSheet(devEui);
   }


   // Flatten JSON object
   var flattenedData = flatten(jsonData);


   // If headers are not set, set them
   if (sheet.getLastRow() == 0) {
     var headers = Object.keys(flattenedData);
     sheet.appendRow(headers);
   }


   var nextRow = sheet.getLastRow() + 1; // get next row


   // Extract data from JSON object
   var rowData = Object.values(flattenedData);


   // Append data to the next empty row in the spreadsheet
   sheet.appendRow(rowData);
  
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
