
'use strict';

const admin = require('firebase-admin');

const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const { WebhookClient } = require('dialogflow-fulfillment');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

  const agent = new WebhookClient({ request, response });

  let intentMap = new Map();

  intentMap.set('lights I/O', lightsIO);
  intentMap.set('status I/O', statusIO);

  function lightsIO(agent) {

    let type = agent.parameters.type;
    let ids = agent.parameters.ids;
    let collection = db.collection('lights');

    if(type === 'on' || type === 'off') {

      // when ids contains all lights

      for(let i = 0; i < ids.length; i++) {
        if(ids[i].indexOf(",") > -1) {
          ids = ids[i].split(',');
        }
      }

      var batch = db.batch();

      var lightRef;

      ids.forEach((val) => {
        lightRef = collection.doc(val);
        batch.set(lightRef, { state: type });
      });

      return batch.commit().then(() => {
        console.log('type: ', type, ' ids: ', ids);
        agent.add(`Okay ${ids.toString()} now ${type}.`);
        return null;
      });

    }
    else {
      agent.add(`Sorry, i think you misspelled!`);
    }

  }
  function statusIO(agent) {

    let ids = agent.parameters.ids;

    // when ids contains all lights

    for(let i = 0; i < ids.length; i++) {
      if(ids[i].indexOf(",") > -1) {
        ids = ids[i].split(',');
      }
    }

    console.log('ids: ', ids);

    let lights = {};

    return db.collection('lights').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          lights[doc.id] = doc.data();
        });
        return null;
      })
      .then(() => {
        console.info(JSON.stringify(lights, null, 4));
        var res = '';
        ids.forEach((id) => {
          res += `${id} is ${lights[id].state},  \n`;
        });
        return agent.add(res);
      })
      .catch((err) => {
        console.log('Error getting iformation ', err);
      });

  }

  agent.handleRequest(intentMap);

});
