<template>

  <section class="vh-100" >
      <div class="container py-5">

        <div class="d-flex flex-row justify-content-center align-items-center margin-auto">


          <div class="container d-flex flex-column align-items-center">
            <!-- <div class="container py-5"></div> -->
            <!-- <div class="text-center d-flex flex-column"> -->
              <h1 style="text-shadow:2px 2px 8px grey; ;">Record your Spendings!</h1>
              <img src="src/assets/images/money.avif" width="370px" height="auto" style="padding-left: 110px;">
              <br>
              <p>Just fill in your spending details and it will be saved!</p>
            <!-- </div> -->
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

                <div class="form-outline mb-4" v-if="isGroupTrip">Spending type:
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Individual" v-model="spendingType">
                    <label class="form-check-label" for="inlineRadio1">Individual</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Group" v-model="spendingType">
                    <label class="form-check-label" for="inlineRadio2">Group</label>
                  </div>
                </div>


                <div class="form-outline mb-4" v-if="isGroupTrip && isGroup">
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

  </section>

</template>


<script>
  import db from '../firebase.js';
  import { collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
  //import Logout from '@/components/Logout.vue'
  import firebaseApp from '@/firebase.js'
  import {getAuth, onAuthStateChanged} from 'firebase/auth'

  export default {
    name: "InputPage",

    data() {

      return {
          description:"",
          amount:"",
          category:"",
          date: new Date().toISOString().substr(0, 10), //autofill today's date
          spendingType: "Individual",
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
        // const isoString = new Date(this.date).toISOString();
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
            Expenses : arrayUnion(expenseDocRef.id) //CHANGED
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
                  usersRefArray: doc.data().Users}); //CHANGED
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
        // this.tripsArray = [];
        this.minDate = "";
        this.maxDate = "";
        // this.usersArray = [];
        this.selectedUsersArray = [];
        this.isGroupTrip = false;
        // this.uid = "";
      }

    },

    mounted() {
      const auth = getAuth()
          onAuthStateChanged(auth, (user) => {
              if (user) {
                this.uid = user.uid;
                console.log(this.uid)
                this.populateTripsArray();
              }
              else {
                console.log("logged out")
              }
          })

      // if (auth.currentUser) { //probably true
      //   console.log(auth.currentUser)
      //   this.uid = auth.currentUser.uid;
      //   // this.uid = "5CymwvZ7sORrKGB8CzkTuHfeKdJ2";

      //   this.populateTripsArray();
      // }

    //  this.populateTripsArray();
    //  const auth = getAuth()
    //  onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       this.user = user
    //       this.userid = user.uid
    //       console.log("logged in")
    //     }
    //     else {
    //       console.log("logged out")
    //     }
    //
    //   })
    }
  }

</script>



<style>
  section {
    /* WHERE */
    background-color: floralwhite;
    background-image: url('picture/input1.jpg');
    margin:auto;
  }
</style>
