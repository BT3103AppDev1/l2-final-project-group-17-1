<template>

<section class="vh-80 bg-image" >
        <div class="container py-5 h-100">
          <div class="d-flex justify-content-center align-items-center h-100">

            <div class="col-md d-flex flex-column align-items-center ">
              <div class="text-center py-5">
                <h1>Welcome to <b>TrackTrip</b></h1>
                <img id="trackTripImg" src="src/assets/images/money_login.png" style="height: 200px; margin-top:20px; margin-bottom: 20px;">
                <h6>Gain control over your spending now! Be it yourself, or with friends!</h6>
              </div>
            </div>

            <div class="col-md" >
              <div class="card " style="border-radius: 1rem; width: 500px; background-color: rgba(255, 255, 255, 0.7); border: none;">
                <div class="card-body p-5 text-center shadow-2-strong" >

                  <h3 class="mb-5">Sign In</h3>

                  <div id = "firebaseui-auth-container" @submit.prevent="setUser"></div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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
                    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                        const isNewUser = authResult.additionalUserInfo.isNewUser;
                        if (isNewUser) {
                          console.log("New user signed up!");

                          const email = authResult.user.email;
                          const uid = authResult.user.uid
                          const name = authResult.user.displayName
                          //console.log(String(email))
                          // setUser(email, uid).then(()=>{
                          //     console.log("user created")
                          // })
                          setUser(email, uid, name)
                              .then(() => {
                                  window.location.href = "/InputPage"
                              })
                              .catch(error => {
                                  console.error("error adding user data to database", error)
                              });
                          return false;
                        }
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

         created() { //sign user out everytime they go to login page
            firebase.auth().signOut().then(() => {
              // Sign-out successful.
              alert('Please log in to continue');
            }).catch((error) => {
            });
         },

        //  async created() {
        //     if (await firebase.auth().currentUser) { //check if a user is currently signed in
        //       firebase.auth().signOut().then(() => { //sign user out if they are currently signed in
        //         alert('You have been signed out');
        //       }).catch((error) => {
        //         console.log(error);
        //       });
        //     }
        //   },

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
    async function setUser(email, uid, name) {
        console.log(name)
        try {
            const user = {
            Email: email,
            UID: uid,
            Name : name,
            Trips: []
            }
            await setDoc(doc(db, "User", String(uid)), user);
        }
        catch(error) {
            console.error("Error adding user: ", error)
        }
    }

 </script>


 <style scoped>

  .bg-image {
  background-image: url('src/assets/images/beach.jpeg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  }

 </style>
