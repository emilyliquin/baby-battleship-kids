/* eslint-disable max-len */
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();


// make function that is called from within the app when the study ends (move data to secure database and, eventually, compute bonus)
exports.finalizeData = functions.https.onCall((data, context) => {
  const mode = data.mode;
  const studyID = data.studyID;
  // const docRef = data.docRef;

  const tempDataCollection = db.collection(mode).doc(studyID).collection("temp");
  const permanentDataCollection = db.collection(mode).doc(studyID).collection("data");

  // get each document in temporary data storage, add bonus, then move to permanent data storage
  tempDataCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const docRef = doc.id;
      let docData = doc.data();

      // if they finished the study, compute the bonus
      if (docData.done === true) {
        // ADD CODE HERE TO COMPUTE BONUS
        const participantBonus = 0;
        // then save the bonus to the data
        docData.bonus = participantBonus;
      }

      // if it's done, withdrawn, or it's been more than three hours since the start time
      if (docData.done === true || docData.withdraw === true || Date.now() - docData.start_time > 1.08e7) {
        // Get the private data
        const tempPrivate = tempDataCollection.doc(docRef).collection("private").doc("private_data");
        tempPrivate.get().then((privatedoc) => {
          // then save it to the data as well
          if (privatedoc.exists) {
            docData = Object.assign({}, docData, privatedoc);
          }
        });
        // save the data to the permanent location
        permanentDataCollection.doc(docRef).set(docData).then(() => {
          // then also delete everything from the temp location
          tempPrivate.delete();
          tempDataCollection.doc(docRef).delete();
        });
      }
    });
  });

  return null;
});

