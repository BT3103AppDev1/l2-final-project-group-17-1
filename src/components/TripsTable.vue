<template>
  <div :key="componentKey">

    <h1 style = "text-shadow: 2px 2px 7px grey; margin-left: 5%; margin-top: 0px; padding-top: 70px;">
      Your Trips
      <img src="src/assets/images/planecropped.PNG" style="object-position: right; margin-left: 20px; height: 100px;">
    </h1>

    <div class="scrollable">
        <table id="fullTable" class="table table-bordered  table-scroll text-center" v-if="haveTrips">
        <thead>
            <tr>
            <th class="th-sm">Select Trip</th>
            <th class="th-sm">Date</th>
            <th class="th-sm">People</th>
            <th class="th-sm">Currency</th>
            <th class="th-sm">Net owed to you</th>
            <th class="th-sm">Your Expenses</th>
            <th class="th-sm">Your Budget</th>
            <th id = "tripcode">Trip Code</th>
            <th>Options</th>
            </tr>
        </thead>
        </table>
    </div>
    <h1 v-if="!haveTrips" style="text-align: center;">You Have No Trips! </h1>

   <!-- <section class="text-dark" id="topBar" style="background-color: floralwhite;">
      <div class="container">
          <div class="d-flex justify-content-between">
              <div class="text-center py-5" style= "width: 40rem;">
                  <div id="tripName" class="card-body px-5 d-flex flex-row">
                      <h1 style = "text-shadow: 2px 2px 7px grey">
                        Your Trips
                        <img src="src/assets/images/planecropped.PNG" width="100px" style="object-position: right; margin-left: 20px; height: 100px;">
                      </h1>
                  </div>
              </div>
          </div>
      </div>
    </section> -->


  <!-- <section id = "currency" style = "background-color: floralwhite;">
      <div class="d-flex justify-content-between px-3" style="text-align:justify;">

        <div class="d-flex flex-row">
          <div class="scrollable">
            <table id="fullTable" class="table table-bordered  table-scroll text-center" cellspacing="0"
            width="100%" style="background-color: floralwhite; margin-left: 70px; z-index: 0; position: relative; margin-top: 50px" v-if="haveTrips">
            <thead style="background-color: rgb(156, 201, 215); ">
                <tr>
                <th class="th-sm">Select Trip
                </th>
                <th class="th-sm">Date
                </th>
                <th class="th-sm">People
                </th>
                <th class="th-sm">Currency
                </th>
                <th class="th-sm">Net owed to you
                </th>
                <th class="th-sm">Your Expenses
                </th>
                <th class="th-sm">Your Budget
                </th>
                <th id = "tripcode">Trip Code
                </th>
                <th>Options</th>
                </tr>
            </thead>
            </table>
        </div>

        <div class = "dropdown px-3">
        <div style="padding-left: 10px; z-index: 1; position: relative; ">
              <button class = "btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: rgb(52, 146, 175); margin-bottom: 5px;">
                  Currency
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">SGD</a>
                  <a class="dropdown-item" href="#">Original</a>
              </div>
            </div>
          </div>

          <div class = "dropdown px-3">
            <div class = "currencyButton" style="padding-left: 1250px;">
              <button class = "btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: rgb(52, 146, 175); margin-bottom: 5px;">
                  Currency
              </button>

              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">SGD</a>
                  <a class="dropdown-item" href="#">Original</a>
              </div>
            </div>

            </div>

          </div>

      </div>
    </section> -->

  </div>
</template>


<script>

    import db from '../firebase.js';
    import { collection, doc, getDocs, getDoc, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore, onSnapshot} from "firebase/firestore";
    //import Navbar from '@/components/Navbar.vue';
    // const db = getFirestore(app);
    import router from "../router"
    import {getAuth, onAuthStateChanged} from 'firebase/auth'


    export default {
        name: 'Trips',
        components: {

        },
        data() {
          return {
            userid : "",
            componentKey: 0,
          }
        },
        computed: {
          haveTrips() {
            const collectionRef = getDocs(collection(db, "Trip"));
            return collectionRef.size != 0;
          }
        },
        updated() {
          this.displayTrips();
        },
        mounted() {
          const auth = getAuth()
          onAuthStateChanged(auth, (user) => {
              if (user) {
                this.user = user
                this.userid = user.uid
                console.log("logged in")
              }
              else {
                console.log("logged out")
              }
          })
          this.displayTrips()
        },
        methods: {
            async displayTrips() {
              let allTrips = await getDocs(collection(db, "Trip"))
              let allUsers = await getDocs(collection(db, "User"))
              let allExpenses = await getDocs(collection(db, "Expense"))
              const userRef = doc(db, 'User', this.userid);
              let tripsArray = [];
              let budgetArray = [];
              await getDoc(userRef)
                .then((doc) => {
                  if (doc.exists()) {
                    doc.data().Trips.forEach(trip => {
                      tripsArray.push(trip.Trip_Code) //tripcode
                      budgetArray.push(trip.Budget);
                    })
                  } else {
                    console.log('no such user');
                  }
                })
                .catch((error) => {
                  console.log('Error getting document:', error);
                });
              // let currUser = await getDoc(doc(db, "User", this.userid))

              Promise.all([allTrips, allUsers, allExpenses]).then(results => {
                let index = 1
                allTrips.forEach((doc) => {
                  let tripCode = doc.id
                  if (tripsArray.includes(tripCode)) {
                    let tripData = doc.data()
                    let tripName = tripData.Name
                    let startDate = tripData.Start_Date
                    let endDate = tripData.End_Date
                    let budget = budgetArray[tripsArray.indexOf(tripCode)]
                    let people = tripData.Users //array
                    let currency = tripData.Currency
                    let tripExpenses = tripData.Expenses
                    // console.log(typeof tripData)
                    // let tripCode =

                    // let tripCode = tripData.Trip_Code
                    const namesArray = [];

                    // people.forEach(user => {
                    //   let ref = doc(db, 'User', user);
                    //   getDoc(ref)
                    //     .then((doc) => {
                    //       let name = doc.data().Name;
                    //       namesArray.push(name)
                    //     })
                    // })
                    //const users = getDocs(collection(db, "User"))
                    allUsers.forEach((doc) => {
                      let userid = doc.id;
                      if (people.includes(userid)) {
                        const name = doc.data().Name
                        namesArray.push(name)
                      }
                    })

                    let tripsTable = document.getElementById("fullTable")
                    let row = tripsTable.insertRow(index)

                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    let cell4 = row.insertCell(3);
                    let cell5 = row.insertCell(4);
                    let cell6 = row.insertCell(5);
                    let cell7 = row.insertCell(6);
                    let cell8 = row.insertCell(7);
                    let cell9 = row.insertCell(8);

                    const resultPromise = this.loadExpenses(tripExpenses);
                    resultPromise.then((result) => {
                      const expense = result.expense;
                      const netowe = result.netowe;
                      cell5.innerHTML = netowe;
                      cell6.innerHTML = expense; //expenses
                    });

                    cell2.innerHTML = startDate + " - "+ endDate ;
                    cell3.innerHTML = namesArray; //people;
                    cell4.innerHTML = currency;
                    cell7.innerHTML = budget;

                    // let code = document.createElement("p")
                    // code.textContent = tripCode;
                    // // code.style.content = "fit"
                    // cell8.appendChild(code)
                    cell8.innerHTML = tripCode;


                    let tripButton = document.createElement("button")
                    // tripButton.id  = String(tripName)
                    tripButton.className= "bwt"
                    tripButton.innerHTML = tripName
                    tripButton.onclick = function() {
                      //router.push('/PersonalPage')
                      try {
                        router.push({name:'PersonalPage',
                          // params:{
                          // tripCode:tripCode,
                          // budget:budget,
                          // tripName:tripName,
                          // startDate:startDate,
                          // endDate:endDate,
                          // tripExpenses: JSON.stringify(tripExpenses),
                          // people: JSON.stringify(people),
                          // currency:currency,
                          query: {
                            tripCode: tripCode, tripName: tripName, currency: currency
                          }})
                        //showTrip(tripCode)
                      } catch(e) {
                        console.error(e.message)
                      }
                    }
                    cell1.appendChild(tripButton)


                    let deleteTripButton = document.createElement("button")
                    deleteTripButton.id = String(tripName)
                    deleteTripButton.className = "bwt"
                    deleteTripButton.innerHTML = "Leave"

                    cell9.appendChild(deleteTripButton)
                    deleteTripButton.onclick = function() {
                      try {
                        //deleteTrip(tripName)
                        deleteTrip(tripCode)
                      } catch(e) {
                        console.error(e.message)
                      }
                    }
                    index +=1
                  }
              })
            })
            },
            async deleteTrip(tripCode){
              alert("You are going to delete " + tripCode)


                await deleteDoc(doc(db, "Trip", tripCode))
                // await db.collection("Trip").doc(tripNme).delete()

              console.log("Trip successfully deleted!", tripCode)
              let tb = document.getElementById("fullTable")
              for (var i = 0; i < tb.rows.length; i++) {
                var row = tb.rows[i];
                var value = row.cells[7].innerHTML;
                if (value == tripCode) {
                  tb.deleteRow(i);
                }
              }
              // while (tb.rows.length>1){
              //   //tb.deleteRow(1)
              // }
              //displayTrips()
            },
            refresh() {
              this.componentKey += 1;
            },
            async loadExpenses(expRefs) {
              let expense = 0;
              let netowe = 0;
              try {
                for (const expRef of expRefs) {
                  const docRef = doc(db, "Expense", expRef);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                    const exp = docSnap.data()
                    if (exp.Users.includes(this.userid)) {
                      const pax = exp.Users.length
                      const amt = exp.Amount
                      if (pax == 1) {
                        expense += amt
                      } else {
                        expense += amt / pax
                        if (this.userid == exp.Paid_By) {
                          netowe += amt/pax*(pax - 1)
                        } else  {
                          netowe -= amt/pax
                        }
                    }
                    }
                  }
                }
                const result = {expense: expense.toFixed(2),
                                netowe: netowe.toFixed(2)}
                return result;
              } catch (error) {
                console.log("Error calculating expense", error);
              }
            }
        }

    }

</script>

<style scoped>
      body {
        background-color: floralwhite;
      }

      #fullTable {
        width: 90%;
        border-collapse: collapse;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
        /* table-layout: fixed; */
        position: auto;
        background-color: floralwhite;
        margin-left: 70px;
        margin-top: 50px;
        z-index: 0;
        position: relative;
      }

      th, td {
          padding: 15px;
          background-color: rgba(255,255,255,0.2);
          color: black;
          font-family: Arial, Helvetica, sans-serif;
          height: 10px;
      }

      thead th {
          background-color: #55608f;
          color: black;

      }

      table td.scroll {
        overflow-x: auto;
      }

      #fullTableSection h1 {
              color: #111;
              font-family: 'Helvetica Neue', sans-serif;
              font-size: 50px;
              /* font-weight: bold;  */
              letter-spacing: -1px;
              line-height: 1;
              text-align: left;
      }

      th {
          text-align: center;
          color:white;
      }

      #dropdownMenuButton {
        /* margin: 0;
        padding: 0; */
        bottom: 30px;
        left: 70px;
      }

      #topBar {
        margin-bottom: 0;
        bottom: 0;
        display: inline
      }
</style>
