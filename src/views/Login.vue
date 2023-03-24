<template>
    <h1 style="align-items: center;">Welcome to TrackTrip!</h1>
    <h2 style="align-items: center;">Login Here</h2>
    <div id = "firebaseui-auth-container"></div>
 </template>
 
 <script>
 import db from '../firebase.js';
 import firebaseApp from '@/firebase.js'
 import {getAuth, onAuthStateChanged} from 'firebase/auth'
 import firebase from '@/uifire.js'
 import 'firebase/compat/auth'
 import * as firebaseui from 'firebaseui'
 import 'firebaseui/dist/firebaseui.css'
 import { doc, collection, addDoc, setDoc} from "firebase/firestore";
 const auth = getAuth()

     export default {
         name: 'LogIn',
         components: {
             
         },
         mounted() {
            var ui = firebaseui.auth.AuthUI.getInstance();
            if (!ui) {
                ui = new firebaseui.auth.AuthUI(firebase.auth());
                //db.collection("User").doc(String(this.useremail)).set({Email:"this.useremail"})
            }
            var uiConfig = {
                signInSuccessUrl: '/InputPage',
                signInFlow: 'redirect',
                callbacks: {
                    signInSuccessWithAuthResult: function(authResult) {
                        const email         = authResult.user.email;
                        const uid = authResult.user.uid
                        //console.log(String(email))
                        setUser(email, uid);
                        return true;
                    },
                },
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID, 
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                ],
            
                // tosUrl: '/tos',
                // privacyPolicyUrl: function() {
                //     window.location.assign('/pp');
                // }
            };

            ui.start("#firebaseui-auth-container", uiConfig)
         },
    
        //   async createUser(){
        //     try {
        //         const docRef = await addDoc(collection(db, "User", String(this.useremail)), {
        //             Name: this.user,
        //             Email: this.useremail,
        //             Trips: this.trips
        //         })
        //         console.log(docRef)
        //         }

        //     catch(error) {
        //         console.error("Error adding document: ", error);
        //     }
        //   }
   }
    async function setUser(email, uid) {
        try {
            const user = {
            Email: email,
            UID: uid,
            Trips: []
            }
            await setDoc(doc(db, "User", String(email)), user);
        }
        catch(error) {
            console.error("Error adding user: ", error)
        }
    }
 </script>
 
 <style scoped>
    
 </style>
 
 