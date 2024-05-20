import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDYdSezsUmnMepHHXC08LyyTo3QwqJluvs",
    authDomain: "spendsense-5e5da.firebaseapp.com",
    projectId: "spendsense-5e5da",
    storageBucket: "spendsense-5e5da.appspot.com",
    messagingSenderId: "858063095687",
    appId: "1:858063095687:web:f4d484bedd60567b8e7522",
    measurementId: "G-DE5K33G39K"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
