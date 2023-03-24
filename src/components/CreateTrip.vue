<template>
    <section class="py-5" style="background-color: floralwhite">
    <section class="d-flex flex-row container">
      <div class="container" id="createtripform">
        <div class="justify-content-center h-100">

          <div class="align-items-center ">
            <div class="text-center">
            <h1>Create a new Trip!</h1>
            <p>Create a new Trip and share with your friends!</p>
            </div>
          </div>

          <div class="container">
            <div class="card shadow-2-strong" style="border-radius: 1rem; background-color: rgb(179, 214, 214);">
              <div class="card-body p-4 text-center">

                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model = "tripName"/>
                  <label class="form-label" for="typeEmail">Trip Name</label>
                </div>
                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model = "budget"/>
                  <label class="form-label" for="typeEmail">Budget</label>
                </div>

                <div class="form-outline mb-4">
                  <div class="bfh-selectbox bfh-currencies" data-currency="EUR" data-flags="true">
                    <label for="cars">Currency:</label>
                    <select v-model="currency" id = "currency">
                      <option v-for="currency in currencies" :key = "currency" :value = "currency">{{ currency }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-outline mb-4">
                  <label for="date">Start Date: </label>
                  <input type="date" id="startdate" name="date" v-model = "startDate">
                </div>
                <div class="form-outline mb-4">
                  <label for="date">End Date: </label>
                  <input type="date" id="enddate" name="date" v-model = "endDate">
                </div>
                <button class="btn btn-lg btn-block shadow text-light" type="submit" v-on:click="createTrip" style="background-color: #3d6d9e;">Save</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
  import db from '../firebase.js';
  import { collection, doc, setDoc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
  import Navbar from '@/components/Navbar.vue';
  import TripsTable from '@/components/TripsTable.vue'
  import firebaseApp from '@/firebase.js'
  import {getAuth, onAuthStateChanged} from 'firebase/auth'
  //import firebaseApp from "../firebase.js";
  //import { getFirestore } from "firebase/firestore";
  //import {setDoc } from "firebase/firestore";
  // const db = getFirestore(firebaseApp);
  // const {uid} = useUid();

  export default {
        name: 'Trips',
        components: {
            Navbar,
            TripsTable
        }, 
        
        data() {
          return {
            tripName: "",
            budget: "",
            startDate: "",
            endDate: "",
            currency: "",
            currencies: ["USD", "JPY", "GBP", "EUR", "SGD"],
            users: [],
            expenses: []
          }
        },
        mounted() {
          const auth = getAuth()
          onAuthStateChanged(auth, (user) => {
            if (user) {
              this.user = user
              this.useremail = auth.currentUser.email
              this.userid = user.uid
            }
          })
        },
        methods: {
          async createTrip(){

            // let tripName = document.getElementById("typeEmail").value
            // let startDate = document.getElementById("startdate").value
            // let endDate = document.getElementById("enddate").value
            // let currency = document.getElementById("currency").value
            //currency = currency
            //let people = tripData.userIds  //array
            //let currency = this.currency
            //alert("Saving your new trip details!");
        

            try {
              const docRef = await addDoc(collection(db, "Trip"), {
                Name: this.tripName,
                Currency: this.currency,
                Budget: this.budget,
                Start_Date: this.startDate, 
                End_Date: this.endDate,
                Users : arrayUnion(String(this.userid)),
                Expenses: []
              })
              console.log(docRef)
              const userDocRef = await updateDoc(doc(db, "User", this.userid), {
                Trips: arrayUnion(docRef.id)
              })
              //document.getElementById("createtripform").reset();
              // this.$emit("added");
            }

            catch(error) {
              console.error("Error adding document: ", error);
            }
          }
        },
  }
</script>

<!-- "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" 
    integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" 
    crossorigin="anonymous" -->