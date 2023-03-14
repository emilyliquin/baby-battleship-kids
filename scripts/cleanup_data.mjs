#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import inquirer from 'inquirer'
import chalk from 'chalk'
import figlet from 'figlet'
import { execSync } from 'child_process'
// import shell from 'shelljs'
// import { initializeApp } from 'firebase/app'
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore"
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
// import appconfig from '../src/config'

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync('SMILE.', {
        font: 'big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )
  console.log(chalk.red('WARNING! Only clean up data if there are no in-progress sessions.'))
}

const askQuestions = () => {
  const questions = [
    {
      type: 'list',
      name: 'TYPE',
      message: 'What type of data do you want to clean up?',
      choices: ['testing', 'real'],
    },
    {
      type: 'input',
      name: 'KEY_PATH',
      message: 'What is the path to your service account key?',
      default:'',
    },
  ]
  return inquirer.prompt(questions)
}

const success = () => {
  console.log(
    chalk.red("your data has been moved out of the temporary collection.")
  )
}


const cleanUpData = async (mode, studyID, db) => {

  const tempDataCollection = db.collection(mode).doc(studyID).collection("temp");
  const permanentDataCollection = db.collection(mode).doc(studyID).collection("data");

  // get each document in temporary data storage, add bonus, then move to permanent data storage
  const querySnapshot = await tempDataCollection.get()
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
    await batch.commit()
  });
}


const run = async () => {
  // show script introduction
  init()
  const env = dotenv.config({ path: 'env/.env.git.local' })
  const project_ref = `${env.parsed.VITE_GIT_OWNER}-${env.parsed.VITE_PROJECT_NAME}-${env.parsed.VITE_GIT_BRANCH_NAME}`

  // ask questions
  const answers = await askQuestions()
  const { TYPE, KEY_PATH } = answers

  // connect to database
  const localenv = dotenv.config({ path: 'env/.env.local' })
  const firebaseConfig = {
    apiKey: localenv.parsed.VITE_FIREBASE_APIKEY,
    authDomain: localenv.parsed.VITE_FIREBASE_AUTHDOMAIN,
    projectId: localenv.parsed.VITE_FIREBASE_PROJECTID,
    storageBucket: localenv.parsed.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: localenv.parsed.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: localenv.parsed.VITE_FIREBASE_APPID,
    credential: cert(KEY_PATH)
  }
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // handle data cleanup
  await cleanUpData(TYPE, project_ref, db)

  // show success message
  success()
}

run()
