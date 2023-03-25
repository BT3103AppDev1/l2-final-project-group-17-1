<template>
    <div class="container" style="background-color: floralwhite;">
        <div class="justify-content-center h-100">

          <div class="align-items-center ">
            <div class="text-center">
            <h1>Join existing Trip!</h1>

            <p>Join a Trip created by your friend!</p>
            </div>
          </div>

          <div class="container">
            <div class="card shadow-2-strong" style="border-radius: 1rem; border-color: #3d6d9e; background-color: rgb(179, 214, 214);">
              <div class="card-body p-4 text-center">

                <div class="form-outline mb-4" style="width: 500px">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model = "tripCode"/>
                  <label class="form-label" for="typeEmail">Trip Code</label>
                </div>

                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model = "budget"/>
                  <label class="form-label" for="typeEmail">Budget</label>
                </div>

                <button class="btn btn-lg btn-block shadow text-light" style="background-color: #3d6d9e;" type="submit" v-on:click="joinTrip">Save</button>
                <!-- style="background-color: #2196F3; -->

              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import db from '../firebase.js';
import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default {
    name: 'JoinTrip',
    components: {},
    data() {
        return {
          tripCode: "",
          budget: "",
        }
    },

    mounted() {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user
            this.useremail = auth.currentUser.email
            this.userid = user.uid
            this.name = user.Name
          }
        })
    },

    methods: {
        async joinTrip() {
            console.log(this.tripCode);
            console.log(this.userid)
            try {
                const userRef = await updateDoc(collection(db, "User", this.userid), {
                    Trips: arrayUnion(this.tripCode)
                })
                const tripRef = await updateDoc(collection(db, "Trip", this.tripCode), {
                    Users: arrayUnion(this.userid)
                }) 
            }
            catch(error) {
                console.error("Error adding document: ", error);
            } 
        }
    }
}
</script>