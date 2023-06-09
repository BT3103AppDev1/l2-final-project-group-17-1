// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCy74WbwLMfZo24mLOVsfNte9PyRE8RzOI",
  authDomain: "tracktrip-9c615.firebaseapp.com",
  projectId: "tracktrip-9c615",
  storageBucket: "tracktrip-9c615.appspot.com",
  messagingSenderId: "333599995130",
  appId: "1:333599995130:web:85eb6d390477a0973d4543",
  measurementId: "G-XXSB9LZSVQ"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyCkLK-M2ZLoX9dkJa5PvHAw4jSNgzcx22E",
//   authDomain: "tracktrip2-aac56.firebaseapp.com",
//   projectId: "tracktrip2-aac56",
//   storageBucket: "tracktrip2-aac56.appspot.com",
//   messagingSenderId: "121221502031",
//   appId: "1:121221502031:web:ab3f6af46fc00d7ddec63a"
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
