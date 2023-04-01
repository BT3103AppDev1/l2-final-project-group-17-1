<template>

<section class="vh-100" >
        <div class="container py-5 h-100">
          <div class="d-flex justify-content-center align-items-center h-100">

            <div class="col-md d-flex flex-column align-items-center ">
              <div class="text-center py-5">
                <h1>New Here?</h1>
                <br>
                <p>
                Sign up and gain complete control over your spending now!</p>
              </div>
              <!-- <button class="btn btn-lg btn-block text-light" type="submit" style="background-color: #2196F3;">Sign Up</button> -->
            </div>

            <div class="col-md">
              <div class="card shadow-2-strong" style="border-radius: 1rem;">
                <div class="card-body p-5 text-center">

                  <h3 class="mb-5">Log In</h3>

                  <div id = "firebaseui-auth-container" @submit.prevent="setUser"></div>

                  <!-- <div class="form-outline mb-4">
                    <input type="email" id="typeEmail" class="form-control form-control-lg" />
                    <label class="form-label" for="typeEmail">Email</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input type="password" id="typePassword" class="form-control form-control-lg" />
                    <label class="form-label" for="typePassword">Password</label>
                  </div> -->

                  <!-- Checkbox -->
                  <!-- <div class="form-check d-flex justify-content-start mb-4">
                    <input class="form-check-input" type="checkbox" value="" id="form1Example3" />
                    <label class="form-check-label px-2" for="form1Example3"> Remember Me</label>
                  </div>

                  <button class="btn text-light btn-lg btn-block" type="submit" style="background-color: #2196F3;">Login</button>

                  <hr class="my-4">

                  <button class="btn btn-lg btn-block btn-primary mb-2" style="background-color: #dd4b39;"
                    type="submit"><i class="bi bi-google me-2"></i> Continue with google</button> -->

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




    <!-- <h1 style="align-items: center;">Welcome to TrackTrip!</h1>
    <h2 style="align-items: center;">Login Here</h2> -->
    <!-- <div id = "firebaseui-auth-container" @submit.prevent="setUser"></div> -->
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
                                  // console.log("success")
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

 </style>
