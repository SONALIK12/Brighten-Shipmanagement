

import { getStorage } from "@firebase/storage";
import {initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBgiKl8JGVTo_tfomRSqOCWLKb10mMYvMk",
  authDomain: "shipments-d9645.firebaseapp.com",
  databaseURL: "https://shipments-d9645-default-rtdb.firebaseio.com",
  projectId: "shipments-d9645",
  storageBucket: "shipments-d9645.appspot.com",
  messagingSenderId: "32655284426",
  appId: "1:32655284426:web:39438a8f6ad0b4e161bc33",
  measurementId: "G-2QSWSCQ577"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);


export {db,app,auth,storage};
