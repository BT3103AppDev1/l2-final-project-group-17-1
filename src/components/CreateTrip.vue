<template>

    <div id="createtripform" style="background-color: floralwhite;">

        <div class="text-center align-items-center ">
          <h1>Create a new Trip!</h1>
          <p>Create a new Trip and share with your friends!</p>
        </div>

        <div class="card shadow-2-strong card-body p-5 text-center" style="border-radius: 1rem; background-color: rgb(156, 201, 215);">
          <form>
            <div class="form-outline mb-4">
                <input type="text" id="typeEmail" class="form-control form-control-lg" v-model = "tripName"/>
              <label class="form-label" for="typeEmail">Trip Name</label>
            </div>

            <div class="form-outline mb-4">
              <input type="number" id="typeEmail" class="form-control form-control-lg" v-model = "budget"/>
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

            <div class="bfh-selectbox bfh-currencies" data-currency="EUR" data-flags="true"></div>

            <div class="form-outline mb-4">
              <label for="date">Start Date: </label>
              <input type="date" id="startdate" name="date" v-model = "startDate">
            </div>
            <div class="form-outline mb-4">
              <label for="date">End Date: </label>
              <input type="date" id="enddate" name="date" v-model = "endDate">
            </div>
            <button class="btn btn-lg btn-block shadow text-light" type="submit" v-on:click.prevent="createTrip" style="background-color: #3d6d9e;">Save</button>
          </form>
        </div>

    </div>


</template>

<script>
import db from '../firebase.js';
import { collection, doc, setDoc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
import firebaseApp from '@/firebase.js'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default {
      name: 'Trips',

      data() {
        return {
          tripName: "",
          budget: "",
          startDate: "",
          endDate: "",
          currency: "",
          currencies: ["USD", "JPY", "GBP", "EUR", "CHF", "CAD", "CNY", "HKD", "SGD"],
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
          console.log('inside create trip')
          if (this.tripName == "" || this.budget == "" || this.startDate == "" || this.endDate == "" || this.currency == "") {
            alert("Please fill up all fields")
            this.tripName ='';
            this.budget = '';
            this.currency = '';
            this.startDate = '';
            this.endDate = '';
            return;
          }
          if (this.budget < 0 || isNaN(this.budget)) {
            alert("Please enter a valid budget")
            this.budget = '';
            return;
          }
          //ensure startdate is before enddate
          if (this.startDate > this.endDate) {
            alert("Please enter a valid start and end date")
            this.startDate = '';
            this.endDate = '';
            return;
          }
          try {
            const docRef = await addDoc(collection(db, "Trip"), {
              Name: this.tripName,
              Currency: this.currency,
              // Budget: this.budget,
              Start_Date: this.startDate,
              End_Date: this.endDate,
              Users : arrayUnion(String(this.userid)),
              Expenses: []
            })
            console.log(docRef)
            console.log(this.userid)
            const userDocRef = await updateDoc(doc(db, "User", this.userid), {
              Trips: arrayUnion({Trip_Code: docRef.id,
                Budget: this.budget})
            }).then(() => {
              this.tripName ='';
              this.budget = '';
              this.currency = '';
              this.startDate = '';
              this.endDate = '';
            })
            //document.getElementById("createtripform").reset();
            // this.$emit("added");
            alert("Creating trip ", this.tripName)
            this.$emit('update')
          }
          catch(error) {
            console.error("Error creating trip: ", error);
          }

        },
      },
}
</script>

<!-- "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
  crossorigin="anonymous" -->

<style scoped>
  input:hover {
    transform: scale(1.015); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
  }
  select:hover {
    transform: scale(1.02); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
  }
  button:hover {
    transform: scale(1.05); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
  }
</style>
