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
      const docData = doc.data();

      // ADD CODE HERE TO COMPUTE BONUS
      docData.bonus = 100;

      // first, get the private data
      const tempPrivate = tempDataCollection.doc(docRef).collection("private").doc("private_data");
      tempPrivate.get().then((privatedoc) => {
        // then, once you have it, save it to the permanent collection
        if (privatedoc.exists) {
          permanentDataCollection.doc(docRef).collection("private").doc("privateData").set(privatedoc.data()).then(() => {
            // then delete the temp private data
            tempPrivate.delete();
          });
        }
      });
      // save the main data to the permanent location
      permanentDataCollection.doc(docRef).set(docData).then(() => {
        // then also delete that document from the temp location
        tempDataCollection.doc(docRef).delete();
      });
    });
  });

  return null;
});

