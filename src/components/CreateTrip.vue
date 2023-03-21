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
                  <input type="email" id="typeEmail" class="form-control form-control-lg" />
                  <label class="form-label" for="typeEmail">Trip Name</label>
                </div>
                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" />
                  <label class="form-label" for="typeEmail">Budget</label>
                </div>

                <div class="form-outline mb-4">
                  <div class="bfh-selectbox bfh-currencies" data-currency="EUR" data-flags="true">
                    <label for="cars">Currency:</label>
                    <select v-model="currency" @input="currency">
                      <option v-for="currency in currencies"></option>
                      <!-- <option data-country="us" value="USD">United States Dollar</option>
                      <option data-country="gb" value="GBP">British Pound Sterling</option>
                      <option data-country="jp" value="JPY">Japanese Yen</option> -->
                      <!-- Add more options for other currencies as desired -->
                    </select>
                  </div>
                </div>

                <div class="form-outline mb-4">
                  <label for="date">Start Date: </label>
                  <input type="date" id="startdate" name="date">
                </div>
                <div class="form-outline mb-4">
                  <label for="date">End Date: </label>
                  <input type="date" id="enddate" name="date">
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
  import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
  import Navbar from '@/components/Navbar.vue';
  import TripsTable from '@/components/TripsTable.vue'
  //import firebaseApp from "../firebase.js";
  //import { getFirestore } from "firebase/firestore";
  //import {setDoc } from "firebase/firestore";
  // const db = getFirestore(firebaseApp);

  export default {
        name: 'Trips',
        components: {
            Navbar,
            TripsTable
        }, 
        data() {
          return {
            currency: "",
            currencies: ["USD", "JPY", "GBP", "SGD"]
          }
        },
        mounted() {
          async function createTrip(){

            let tripName = document.getElementById("typeEmail").value
            let startDate = document.getElementById("startdate").value
            let endDate = document.getElementById("enddate").value
            //currency = currency
            //let people = tripData.userIds  //array
            //let currency = this.currency
            //alert("Saving your new trip details!");

            try {
              const docRef = await addDoc(collection(db, "Trip", tripName), {
                name: tripName,
                Currency: this.currency,
                start_date: startDate, 
                end_date: endDate,
              })
              console.log(docRef)
              document.getElementById("createtripform").reset();
              this.$emit("added");
            }

            catch(error) {
              console.error("Error adding document: ", error);
            }
          }
          createTrip()
        }
  }
</script>

<!-- "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" 
    integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" 
    crossorigin="anonymous" -->