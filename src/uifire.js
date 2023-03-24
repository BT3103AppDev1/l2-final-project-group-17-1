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

firebase.initializeApp(firebaseConfig)
export default firebase;