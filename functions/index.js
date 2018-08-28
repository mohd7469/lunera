
'use strict';

const admin = require('firebase-admin');

const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const { WebhookClient } = require('dialogflow-fulfillment');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const agent = new WebhookClient({ request, response });

    //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));

    let intentMap = new Map();

    intentMap.set('lights I/O', lightsIO);

    function lightsIO(agent) {
        let type = agent.parameters.type;
        let ids = agent.parameters.ids;

        console.log('type: ', type, ' ids: ', ids);

        if(ids.length < 3) {
            db
                .collection("lights")
                .doc(ids.toString())
                .set({
                    state: type
                })
                .then(() => {
                    console.log("Successfully written!");
                })
                .catch((error) => {
                    console.lof("Error writing document: ", error);
                });
        } else {
            db
                .collection("lights")
                .doc(ids[0])
                .set({
                    state: type
                })
                .doc(ids[1])
                .set({
                    state: type
                })
                .then(() => {
                    console.log("Successfully written!");
                })
                .catch((error) => {
                    console.lof("Error writing document: ", error);
                });
        }

        agent.add(`Ok ${ids.toString()} are now ${type}`);

    }

    agent.handleRequest(intentMap);

});

/*
 let test = {};
 db.collection('').get()
 .then((snapshot) => {
 snapshot.forEach((doc) => {
 test[doc.id] = doc.data();
 });
 return null;
 })
 .catch((err) => {
 console.log('Error getting documents ', err);
 });

 */