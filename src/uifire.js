import firebase from 'firebase/compat/app';
//import {auth} from './firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'

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
firebase.initializeApp(firebaseConfig)
export default firebase;
