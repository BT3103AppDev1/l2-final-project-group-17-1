<template>

      <div class="page">
      <div id="page" class="container py-5 d-flex flex-row align-items-center">

          <div class="container d-flex flex-column align-items-center">
              <h1 style="text-shadow:2px 2px 8px grey; ;">Record your Spendings!</h1>
              <img src="src/assets/images/money.avif" style="height: 220px; margin-top: 20px; margin-bottom: 20px;">
              <p>Just fill in your spending details and it will be saved!</p>
          </div>

          <div class="container">
            <div class="card shadow-2-strong" style="border-radius: 1rem; background-color: rgb(179, 214, 214);">
              <div class="card-body p-5 text-center">
              <form ref="myForm">

                <h3 class="mb-5">Add Spending</h3>

                <div class="form-outline mb-4">
                  <input type="text" class="form-control form-control-lg" v-model="description"/>
                  <label class="form-label" for="typeEmail">Description</label>
                </div>

                <div class="form-outline mb-4">
                  <input type="number" class="form-control form-control-lg" v-model="amount"/>
                  <label class="form-label" for="typeEmail">Amount</label>
                </div>

                <div class="form-outline mb-4" >
                  <label>Choose a Trip:</label>
                  <select v-model="trip">
                    <option key="" value=""></option>
                    <option v-for="trip in tripsArray" :key="trip" :value="trip">{{ trip.name }} [{{ trip.startDate }}]</option>
                  </select>
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
                    <input type="date" id="datePicker" v-model="date" :min="minDate" :max="maxDate">
                  </div>
                </div>

                <div class="form-outline mb-4" v-if="isGroupTrip">
                  <p class="mb-0">Who ELSE needs to pay?</p>
                  <div v-for="user in usersArray">
                    <div class="form-check form-check-inline" v-if="user.id!=uid">
                      <input class="form-check-input" type="checkbox" id="inlineCheckbox1" :value="user.id" v-model="selectedUsersArray">
                      <label class="form-check-label" for="inlineCheckbox1">{{ user.name }}</label>
                    </div>
                  </div>
                </div>

                <button class="btn btn-lg btn-block shadow text-light" type="submit" style="background-color: #2196F3;" @click.prevent="savetofs">Save</button>

              </form>
              </div>
            </div>
          </div>
        </div>
      </div>


</template>


<script>
  import db from '../firebase.js';
  import { collection, doc, getDoc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
  import {getAuth, onAuthStateChanged} from 'firebase/auth'

  export default {
    name: "InputPage",

    data() {

      return {
          description:"",
          amount:"",
          category:"",
          date: new Date().toISOString().substr(0, 10), //autofill today's date
          // spendingType: "Individual",
          trip:"",
          tripsArray: [],
          minDate: "",
          maxDate: "",
          usersArray:[],
          selectedUsersArray:[],
          isGroupTrip: false,
          uid: "",
      }
    },

    watch: {
      trip(tripObj) {
        if (tripObj == "") {
          this.minDate = ""
          this.maxDate = ""
          this.usersArray = []
          this.isGroupTrip = false
        } else {
          this.minDate = tripObj.startDate
          this.maxDate = tripObj.endDate
          this.populateUsersArray(tripObj.usersRefArray);
          if (tripObj.usersRefArray.length != 1) {
            this.isGroupTrip = true
          }
        }
      }

    },


    computed: {
      allFieldsFilled() {
        return !!this.description && !!this.amount && !!this.category && !!this.date && !!this.trip;
      },
    },

    methods: {
      async savetofs(){
        if (!this.allFieldsFilled) {
          alert("Please fill all required fields!\nDescription, Amount, Trip, Category, Date")
          return
        }

        alert("Saving your data for Spending")
        try{
          //add expense, get expenseDocRef
          this.selectedUsersArray.push(this.uid)
          const expenseDocRef = await addDoc(collection(db, "Expense"), {
            Description : this.description, Amount : this.amount, Category : this.category,
            Date : this.date,
            // SpendingType : this.spendingType,
            Paid_By : this.uid,
            Users: this.selectedUsersArray
          })

          //add expenseDocRef into array in Trip doc
          const tripDocRef = doc(db, "Trip", this.trip.id);
          await updateDoc(tripDocRef, {
            Expenses : arrayUnion(expenseDocRef.id)
          });
          // document.getElementById('myform').reset();
        }
        catch(error) {
          console.error("Error adding document: ", error);
        }

        this.clearForm()
      },


      async populateTripsArray() {
        const documentRef = await doc(db, "User", this.uid);
        const documentSnapshot = await getDoc(documentRef);

        const tripsObjArray = documentSnapshot.data().Trips

        //extract the Trip_Code from the array of objects
        const tripsRefArray = tripsObjArray.map((tripObj) => {
          return tripObj.Trip_Code
        })


        tripsRefArray.forEach(async (reference) => {
          const documentRef = doc(db, "Trip", reference);
          getDoc(documentRef)
            .then((doc) => {
              if (doc.exists()) {
                this.tripsArray.push({
                  id: doc.id,
                  name: doc.data().Name,
                  startDate: doc.data().Start_Date,
                  endDate: doc.data().End_Date,
                  usersRefArray: doc.data().Users});
              } else {
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        });
      },

      async populateUsersArray(usersRefArray) {
        this.usersArray = []
        usersRefArray.forEach(async (reference) => {
          const documentRef = doc(db, "User", reference);
          getDoc(documentRef)
            .then((doc) => {
              if (doc.exists()) {
                const documentData = {
                  id: doc.id,
                  name: doc.data().Name
                };
                this.usersArray.push(documentData)
              } else {
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        });
      },

      clearForm() {
        this.description = "";
        this.amount = "";
        this.category = "";
        this.date = new Date().toISOString().substr(0, 10);
        this.spendingType = "Individual";
        this.trip = "";
        this.minDate = "";
        this.maxDate = "";
        this.selectedUsersArray = [];
        this.isGroupTrip = false;
        // this.tripsArray = [];
        // this.usersArray = [];
        // this.uid = "";
      }

    },

    created() {
      const auth = getAuth()
          onAuthStateChanged(auth, (user) => {
              if (user) {
                this.uid = user.uid;
                console.log(this.uid)
                this.populateTripsArray();
              }
              else { //redirect to login page if not logged in
                this.$router.push('/')
              }
          })
    },
  }

</script>



<style scoped>
  .page {
    background-color: floralwhite;
    height: 93vh;
    display:flex;
    justify-content: center;
    align-items: center;

    /* background-image: url('picture/input1.jpg'); */
    /* bottom: 0; */
    /* position: fixed; */
    /* top: 0; */
    /* left: 0;  */
    /* right:0; */
    /* height: 100%; */
    /* width: 100%; */
      }
</style>
