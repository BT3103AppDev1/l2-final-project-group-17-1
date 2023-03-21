<template>
  <!-- <Navbar /> -->
  <section class="vh-100" >
      <div class="container py-5 h-100">
        <div class="d-flex flex-row justify-content-center h-100">


          <div class="container d-flex flex-column align-items-center pt-5">
            <div class="container py-5"></div>
            <div class="text-center d-flex flex-column">
              <h1 style="text-shadow:2px 2px 8px grey; ;">Record your Spendings!</h1>
              <img src="src/assets/images/money.avif" width="370px" height="auto" style="padding-left: 110px;">
              <br>
              <p>Just fill in your spending details and it will be saved!</p>
            </div>
          </div>


          <div class="container">
            <div class="card shadow-2-strong" style="border-radius: 1rem; background-color: rgb(179, 214, 214);">
              <div class="card-body p-5 text-center">

                <h3 class="mb-5">Add Spending</h3>

                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model="Description"/>
                  <label class="form-label" for="typeEmail">Description</label>
                </div>

                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model="Amount"/>
                  <label class="form-label" for="typeEmail">Amount</label>
                </div>

                <div class="d-flex flex-row">
                  <div class="form-outline mb-4 px-3">
                    <div class="bfh-selectbox bfh-currencies"  data-currency="EUR" data-flags="true">
                      <label for="cars">Category:</label>
                      <select v-model="Category">
                        <option data-country="us" value="USD">Shopping</option>
                        <option data-country="gb" value="GBP">Food</option>
                        <option data-country="jp" value="JPY">Leisure</option>
                        <option data-country="jp" value="JPY">Travel</option>
                        <option data-country="jp" value="JPY">Accomodation</option>
                        <!-- Add more options for other currencies as desired -->
                      </select>
                    </div>
                  </div>

                  <div class="form-outline mb-4" style="padding-left: 60px;">
                    <label for="date">Date: </label>
                    <input type="date" id="datePicker" v-model="Date">
                  </div>
                </div>


                <div class="form-outline mb-4">Spending type:
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Individual" v-model="SpendingType">
                    <label class="form-check-label" for="inlineRadio1">Individual</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Group" v-model="SpendingType">
                    <label class="form-check-label" for="inlineRadio2">Group</label>
                  </div>
                </div>


                <div class="form-outline mb-4" v-if="isGroup">Who needs to pay?
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
                    <label class="form-check-label" for="inlineCheckbox1">Timothy</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
                    <label class="form-check-label" for="inlineCheckbox2">Abby</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3">
                    <label class="form-check-label" for="inlineCheckbox3">Chancy</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3">
                    <label class="form-check-label" for="inlineCheckbox3">Zhi Qi</label>
                  </div>
                </div>


                <div class="form-outline mb-4" >
                  <label for="cars">Choose a Trip:</label>
                  <select name="cars" id="cars" v-model="Trip" >
                    <!-- <option :value="tripName" v-for="num in tripName.length()">{{ num }}</option> -->
                    <!-- <option :value="tripName" v-for="tripName in tripsArray">{{ tripName }}</option> -->
                    <option v-for="trip in tripsArray" :key="trip.id" :value="trip.id">{{ trip.name }}</option>
                  </select>
                </div>


                <button class="btn btn-lg btn-block shadow text-light" type="submit" style="background-color: #2196F3;" @click="savetofs">Save</button>

              </div>
            </div>
          </div>
        </div>
      </div>

  </section>

</template>


<script>
  import db from '../firebase.js';
  import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
  import Navbar from '@/components/Navbar.vue';

  export default {
    name: "InputPage",
    components: {
      Navbar
    },

    data() {
      return {
          Description:"",
          Amount:"",
          Category:"",
          Date:"",
          SpendingType:"",
          Trip:"",
          tripsArray: []
      }
    },

    computed: {
      isGroup() {
        return this.SpendingType == "Group"; //CHECK EQUALITY SYMBOL
      },
    },

    methods: {
      async savetofs(){
        alert("Saving your data for Spending")

        // const date = document.getElementById('datePicker').value;
        // const timestamp = new Date(date).getTime();
        // const firestoreTimestamp = new Timestamp.fromMillis(timestamp);

        try{
          //add expense, get expenseDocRef
          const expenseDocRef = await addDoc(collection(db, "Expense"), {
            Description : this.Description, Amount : this.Amount, Category : this.Category,
            // Date : firestoreTimestamp,
            SpendingType : this.SpendingType
          })
          console.log(expenseDocRef);

          //add expenseDocRef into array in Trip doc
          const tripDocRef = doc(db, "Trip", this.Trip);
          await updateDoc(tripDocRef, {
            expenseIds : arrayUnion(expenseDocRef)
          });
          // document.getElementById('myform').reset();
          // this.$emit ("added")
        }
        catch(error) {
          console.error("Error adding document: ", error);
        }
      },

      async populateTripsArray() {
        const allTripDocuments = await getDocs(collection(db, "Trip"));
        allTripDocuments.forEach(doc => this.tripsArray.push({
          id: doc.id,
          name: doc.data().name
        }));
      }
    },

    mounted() {
     this.populateTripsArray();
    }
  }

</script>



<style>
  body {
    background-image: url('picture/input1.jpg');
    background-color: floralwhite;
  }
  table {
    width: 1000px;
    border-collapse: collapse;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
    border-bottom-right-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  th, td {
    padding: 15px;
    background-color: rgba(255,255,255,0.2);
    color: black
  }

  thead th {
    background-color: #55608f;
  }

  #fullTableSection h1 {
    color: #111;
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 50px;
    font-weight: bold;
    letter-spacing: -1px;
    line-height: 1;
    text-align: left;
  }

  th {
    text-align: center;
    color:white;
  }

</style>
