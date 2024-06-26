# Google Sheets Apps Scripts Deployment Guide

We will employ Google Sheets for visualising data collected from the Things Network. Google Sheets, a web-based spreadsheet application developed by Google, facilitates real-time collaboration, enabling easy sharing and graphing of flood datasets across community groups. Note, the script here is inspired by [this gist](https://gist.github.com/bmcbride/7069aebd643944c9ee8b) and [this tutorial](https://blog.squix.org/2017/07/thethingsnetwork-how-to-use-google-spreadsheet-to-log-data.html). An overview of Google Sheets is outside the scope of this tutorial. There are, however, plenty of tutorials available online.  To prepare Google Sheets to receive Things Network Sensor readings, we need to create a Google Sheets Apps Script. Here are the steps to get started:

<img width="782" alt="Screenshot 2024-02-15 at 10 04 59" src="https://github.com/dcollin5/ttn-google-sheet-integration/assets/51931924/83d0a2ea-d9d9-4e83-bbc1-6178ab1f5c80">


## Deployment Instructions

To deploy this code on Google Sheets Apps Scripts, follow the steps below:

1. **Create or Open an Existing Google Sheet**:
   - Open the Google Sheet where you want to log the incoming JSON data.
   - Click on Extensions > Apps Script to open the Google Apps Script editor.

2. **Set up the Script**:
   - Within the script editor, paste the provided code from the file ttnGoogleSheetJSONDataHandler.js. Note, if you want all TTN Parameters stored, use the ttnHandleAllJSON.js file
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

6. **Form/Script Integration - Configuring TTN Web Hook**:
The Things Network (TTN) allows for the integration of webhooks, which enable the forwarding of sensor data to external services such as Google Sheets. Here's a brief overview of how to configure a webhook for a TTN application created to forward data to the Google Sheet Apps Script.
   - Log into Things Network Sandbox  https://eu1.cloud.thethings.network/oauth/login , and Click the Application Created
   - Click Integrations and Webhook in the left hand menu. Then click Add Webhook.
   - Select Custom Webhook on the next Screen.
   - Enter a Web Hook ID
   - Select Web Hook Format: JSON
   - Copy the Apps Script URL created above into Base URL. 

The next sensor reading received by the Things Network will be sent to the Google Sheet. 

## Testing with CURL

Once deployed, you can test the script using CURL commands. Here's how:

```bash
curl -X POST -H "Content-Type: application/json" -d @pn_uplink_google.json  <WEB_APP_URL>
```

Replace <WEB_APP_URL> with the URL copied after deploying the web app - Web App URL.

Ensure that pn_uplink_google.json contains valid JSON data to be sent.

## Example JSON Payload
Here's an example JSON payload you can use for testing:

```bash
{
  "dev_eui": "eui-000db8395365333d",
  "distance": 3500,
  "humidity": "50",
  "temperature": 21.77,
  "vdd": "3445"
}
```

This markdown-formatted README file provides clear instructions on how to deploy the Google Sheets Apps Script, how to test it using CURL commands, and includes an example JSON payload for testing purposes. Adjustments and enhancements can be made as per your specific requirements.

## YouTube Videos

The following set of YouTube videos show how to add:

1. [Log into the Things Network and Add an Elsys Ultrasonic Sensor](https://youtu.be/e1_4EG8niEI)

2. [Setting up a Things Network Webhook and the AppScript in Google Sheets for Elsys Ultrasonic Sensor](https://www.youtube.com/watch?v=7KsJ0Zh9yGU)

3. [Sending REST API to Google Sheets App Script for processing data sent from the Things Network](https://youtu.be/6FiKC5Ka12g)

4. [How to reset Things Network Device Nonce - in case the device loses connectivity to the Things Network](https://youtu.be/JatonWsU-rw)

5. [General The Things Network (TTN) tutorial video for adding LoRaWAN IoT devices and gateways](https://www.youtube.com/watch?v=Par4-Gio8po) 
