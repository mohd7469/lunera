
'use strict';

/* Initialize firebase admin */
const admin = require('firebase-admin');

/* Import the firebase-functions package for deployment */
const functions = require('firebase-functions');

/* Initialize firebase functions */
admin.initializeApp(functions.config().firebase);

/* Initialize firebase database */
var db = admin.firestore();

/* Import Dialogflow module from the Actions on Google client library */
const {
  SimpleResponse,
  dialogflow,
  } = require('actions-on-google');

/* Instantiate Dialogflow client */
const app = dialogflow();

app.intent('Default Welcome Intent', (conv) => {

  conv.ask(new SimpleResponse({
    speech: `Welcome to the Lunera`,
    text: `Welcome to the Lunera`
  }));

  conv.add('hello');

});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
