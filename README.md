# Google Sheets Apps Scripts Deployment Guide

We will employ Google Sheets for visualising data collected from the Things Network. Google Sheets, a web-based spreadsheet application developed by Google, facilitates real-time collaboration, enabling easy sharing and graphing of flood datasets across community groups. Note, the script here is inspired by [this gist](https://gist.github.com/bmcbride/7069aebd643944c9ee8b) and [this tutorial](https://blog.squix.org/2017/07/thethingsnetwork-how-to-use-google-spreadsheet-to-log-data.html). An overview of Google Sheets is outside the scope of this tutorial. There are, however, plenty of tutorials available online.  To prepare Google Sheets to receive Things Network Sensor readings, we need to create a Google Sheets Apps Script. Here are the steps to get started:

## Deployment Instructions

To deploy this code on Google Sheets Apps Scripts, follow the steps below:

1. **Create or Open an Existing Google Sheet**:
   - Open the Google Sheet where you want to log the incoming JSON data.
   - Click on Extensions > Apps Script to open the Google Apps Script editor.

2. **Set up the Script**:
   - Within the script editor, paste the provided code.
   - Delete any existing code in the script editor.
   - Note, if you are collecting different sensor parameters then these: 'dev_eui', 'distance', 'humidity', 'pressure', 'temperature', 'vdd', 'date_time', 'current_time', then you will need to update this code.
   - Save your script by clicking the Save button.
   - Rename your project by clicking on "Untitled project" and typing a new name (e.g., "FloodMgt-v1"). Then Click the “Deploy” button, and “New Deployment”

3. **Deploy the Web App**:
   - Click Deploy.
   - Select Type: “Web App”. Enter Description,  and set the “Who has access” to Anyone. This will enable the Things Network to forward data to the worksheet for plotting. Note, every time you change the code, you will need to redeploy the application.
   - The first time you Deploy an App you'll be prompted to authorise access. Click Review permissions, choose an account, and click Allow

5. **Copy Web App URL**:
   - Copy the 'Web App URL' generated after deployment.
   - This URL will be used as the endpoint for sending JSON data from the Things Network. 

6. **Form/Script Integration**:
   - Use the copied URL as the action for your form or script that will be sending JSON data.

## Testing with CURL

Once deployed, you can test the script using CURL commands. Here's how:

```bash
curl -X POST -H "Content-Type: application/json" -d @sample_ttn_json.json  <WEB_APP_URL>
```

Replace <WEB_APP_URL> with the URL copied after deploying the web app - Web App URL.

Ensure that pn_uplink_google.json contains valid JSON data to be sent.

## Example JSON Payload
Here's an example JSON payload you can use for testing:

```bash
{
  "end_device_ids_device_id": "eui-000db8395365333d",
  "deveui": 35,
  "uplink_message_rx_metadata_1_time": "2024-01-30T10:26:17.178Z",
  "uplink_message_decoded_payload_temp": 21.77,
  "end_device_ids_join_eui": "000db5390367365d"
}
```

This markdown-formatted README file provides clear instructions on how to deploy the Google Sheets Apps Script, how to test it using CURL commands, and includes an example JSON payload for testing purposes. Adjustments and enhancements can be made as per your specific requirements.
