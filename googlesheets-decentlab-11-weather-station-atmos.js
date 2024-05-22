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
    //var jsonData = flatten(jsonData2);

    //receive doPost
    var jsonData = JSON.parse(e.postData.contents);

    //for testing
    //var jsonData = jsonData2;

   // console.log(jsonData);
   // console.log('air_temperature: ' + jsonData.uplink_message.decoded_payload.air_temperature.value);
   // console.log('atmospheric_pressure: ' + jsonData.uplink_message.decoded_payload.atmospheric_pressure.value);
   // console.log('battery_voltage: ' + jsonData.uplink_message.decoded_payload.battery_voltage.value);
   // console.log('compass_heading: ' + jsonData.uplink_message.decoded_payload.compass_heading.value);
   // console.log('device_id: ' + jsonData.uplink_message.decoded_payload.device_id);
   // console.log('east_wind_speed: ' + jsonData.uplink_message.decoded_payload.east_wind_speed.value);
   // console.log('lightning_average_distance: ' + jsonData.uplink_message.decoded_payload.lightning_average_distance.value);
   // console.log('lightning_strike_count: ' + jsonData.uplink_message.decoded_payload.lightning_strike_count.value);
   // console.log('maximum_wind_speed: ' + jsonData.uplink_message.decoded_payload.maximum_wind_speed.value);
   // console.log('north_wind_speed: ' + jsonData.uplink_message.decoded_payload.north_wind_speed.value);
   // console.log('precipitation: ' + jsonData.uplink_message.decoded_payload.precipitation.value);
   // console.log('relative_humidity: ' + jsonData.uplink_message.decoded_payload.relative_humidity.value);
   // console.log('sensor_temperature_internal: ' + jsonData.uplink_message.decoded_payload.sensor_temperature_internal.value);
   // console.log('solar_radiation: ' + jsonData.uplink_message.decoded_payload.solar_radiation.value);
   // console.log('vapor_pressure: ' + jsonData.uplink_message.decoded_payload.vapor_pressure.value);
   // console.log('wind_direction: ' + jsonData.uplink_message.decoded_payload.wind_direction.value);
   // console.log('wind_speed: ' + jsonData.uplink_message.decoded_payload.wind_speed.value);
   // console.log('x_orientation_angle: ' + jsonData.uplink_message.decoded_payload.x_orientation_angle.value);
   // console.log('y_orientation_angle: ' + jsonData.uplink_message.decoded_payload.y_orientation_angle.value);

    //var jsonData = flatten(JSON.parse(e.postData.contents));
    var devEui = jsonData.end_device_ids.dev_eui;
    console.log (devEui);

    // Create or open sheet to store received values
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(devEui);
    if (!sheet) {
      sheet = doc.insertSheet(devEui);
      // Set headers if the sheet is newly created
      sheet.appendRow(['dev_eui', 'air_temperature', 'atmospheric_pressure', 'battery_voltage', 'compass_heading', 'device_id','east_wind_speed','lightning_average_distance','lightning_strike_count','maximum_wind_speed','north_wind_speed','precipitation','relative_humidity','sensor_temperature_internal','solar_radiation','vapor_pressure','wind_direction','wind_speed','x_orientation_angle','y_orientation_angle','date_time', 'current_time', 'usa_date']);
    }
    
    var nextRow = sheet.getLastRow() + 1; // get next row

    // Extract data from JSON object
    var rowData = [
      jsonData.end_device_ids.dev_eui,
      jsonData.uplink_message.decoded_payload.air_temperature.value,
      jsonData.uplink_message.decoded_payload.atmospheric_pressure.value,
      jsonData.uplink_message.decoded_payload.battery_voltage.value,
      jsonData.uplink_message.decoded_payload.compass_heading.value,
      jsonData.uplink_message.decoded_payload.device_id,
      jsonData.uplink_message.decoded_payload.east_wind_speed.value,
      jsonData.uplink_message.decoded_payload.lightning_average_distance.value,
      jsonData.uplink_message.decoded_payload.lightning_strike_count.value,
      jsonData.uplink_message.decoded_payload.maximum_wind_speed.value,
      jsonData.uplink_message.decoded_payload.north_wind_speed.value,
      jsonData.uplink_message.decoded_payload.precipitation.value,
      jsonData.uplink_message.decoded_payload.relative_humidity.value,
      jsonData.uplink_message.decoded_payload.sensor_temperature_internal.value,
      jsonData.uplink_message.decoded_payload.solar_radiation.value,
      jsonData.uplink_message.decoded_payload.vapor_pressure.value,
      jsonData.uplink_message.decoded_payload.wind_direction.value,
      jsonData.uplink_message.decoded_payload.wind_speed.value,
      jsonData.uplink_message.decoded_payload.x_orientation_angle.value,
      jsonData.uplink_message.decoded_payload.y_orientation_angle.value,
      dateTime(),
      currentTime(),
      currentDateUSA(),
      // Add more parameters as needed
    ];

    // Append data to the next empty row in the spreadsheet
    sheet.appendRow(rowData);
    
    // Return JSON success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": sheet.getLastRow()}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    // If error, return error message
    console.error(e);
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { // Release lock
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
