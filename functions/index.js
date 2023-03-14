/* eslint-disable max-len */
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();


// make function that is called from within the app when the study ends (move data to secure database and, eventually, compute bonus)
exports.finalizeData = functions.https.onCall(async (data, context) => {
  const mode = data.mode;
  const studyID = data.studyID;

  const tempDataCollection = db.collection(mode).doc(studyID).collection("temp");
  const permanentDataCollection = db.collection(mode).doc(studyID).collection("data");

  // get documents from temporary database
  const querySnapshot = await tempDataCollection.get();
  const promises = [];
  // for each temp document
  querySnapshot.forEach(async (doc) => {
    const docRef = doc.id;
    let docData = doc.data();

    // if they finished the study, compute the bonus
    if (docData.done === true) {
      // ADD CODE HERE TO COMPUTE BONUS
      const participantBonus = 0;
      // then save the bonus to the data
      docData.bonus = participantBonus;
    }

    // if it's done, withdrawn, or it's been more than two hours since the start time, move the data to permanent
    if (docData.done === true || docData.withdraw === true || Date.now() - docData.start_time > 7.2e6) {
      // record whether it timed out
      if (Date.now() - docData.start_time > 7.2e6) {
        docData.timeout = true;
      }

      // get the corresponding private data
      const tempPrivate = tempDataCollection.doc(docRef).collection("private").doc("private_data");
      const privatedoc = await tempPrivate.get();
      if (privatedoc.exists) {
        docData = Object.assign(docData, privatedoc.data());
      }

      // then save the data to the permanent location and delete from temp
      const batch = db.batch();
      batch.set(permanentDataCollection.doc(docRef), docData);
      batch.delete(tempPrivate);
      batch.delete(tempDataCollection.doc(docRef));
      promises.push(batch.commit());
    }
  });
  return Promise.all(promises);
});

