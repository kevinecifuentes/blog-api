// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')
const app = require('../app')
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
}

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig)

const storage = getStorage(fireBaseApp)

module.exports = storage
