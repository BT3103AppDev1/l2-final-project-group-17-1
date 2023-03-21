<template>

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
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model="description"/>
                  <label class="form-label" for="typeEmail">Description</label>
                </div>

                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model="amount"/>
                  <label class="form-label" for="typeEmail">Amount</label>
                </div>

                <div class="d-flex flex-row">
                  <div class="form-outline mb-4 px-3">
                      <label for="cars">Category:</label>
                      <select v-model="category">
                        <option value=""></option>
                        <option value="Shopping">Shopping</option>
                        <option value="Food">Food</option>
                        <option value="Leisure">Leisure</option>
                        <option value="Travel">Travel</option>
                        <option value="Accomodation">Accomodation</option>
                      </select>
                  </div>
                  <div class="form-outline mb-4" style="padding-left: 60px;">
                    <label for="date">Date: </label>
                    <input type="date" id="datePicker" v-model="date">
                  </div>
                </div>

                <div class="form-outline mb-4">Spending type:
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Individual" v-model="spendingType">
                    <label class="form-check-label" for="inlineRadio1">Individual</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Group" v-model="spendingType">
                    <label class="form-check-label" for="inlineRadio2">Group</label>
                  </div>
                </div>


                <div class="form-outline mb-4" v-if="isGroup">
                  <p class="mb-0">Who needs to pay?</p>
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
                  <label>Choose a Trip:</label>
                  <select v-model="trip">
                    <option key="" value=""></option>
                    <option v-for="trip in tripsArray" :key="trip.id" :value="trip.id">{{ trip.name }} [{{ trip.startDate }}]</option>
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
  import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
  import Navbar from '@/components/Navbar.vue';

  export default {
    name: "InputPage",
    components: {
      Navbar
    },

    data() {
      return {
          description:"",
          amount:"",
          category:"",
          date: new Date().toISOString().substr(0, 10), //autofill today's date
          spendingType: "Individual",
          trip:"",
          tripsArray: []
      }
    },

    computed: {
      isGroup() {
        return this.spendingType == "Group"; //CHECK EQUALITY SYMBOL
      },
      allFieldsFilled() {
        return !!this.description && !!this.amount && !!this.category && !!this.date && !!this.spendingType && !!this.trip;
      },
    },

    methods: {
      async savetofs(){
        if (!this.allFieldsFilled) {
          alert("Please fill all fields!")
          return
        }

        alert("Saving your data for Spending")
        const isoString = new Date(this.date).toISOString();
        try{
          //add expense, get expenseDocRef
          const expenseDocRef = await addDoc(collection(db, "Expense"), {
            Description : this.description, Amount : this.amount, Category : this.category,
            Date : isoString,
            SpendingType : this.spendingType
          })

          //add expenseDocRef into array in Trip doc
          const tripDocRef = doc(db, "Trip", this.trip);
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
          name: doc.data().name,
          startDate: doc.data().Start_Date.toDate().toLocaleDateString(),
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
    /* WHERE */
    background-image: url('picture/input1.jpg');
    background-color: floralwhite;
  }
</style>
