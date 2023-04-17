<template>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

  <div :key="componentKey">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1 style = "text-shadow: 2px 2px 7px grey; margin-left: 5%; margin-top: 0px; padding-top: 70px; display: inline-block">
        Your Trips
        <img src="src/assets/images/planecropped.PNG" style="object-position: right; margin-left: 20px; height: 100px;">
      </h1>

      <div>
        <img src="src/assets/images/filter-icon.png" style="object-position: right; margin-right: 3px; height: 18px;">
        <select id="sort" v-model="selectedSort" @change.prevent="sortTable" style=" font-size:13px display: inline-block; margin-right:80px; margin-top:90px; ">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value" >{{ option.name }}</option>
        </select>
      </div>
    </div>

    <div class="scrollable">
        <table id="fullTable" class="table table-bordered  table-scroll text-center" v-if="haveTrips">
        <thead>
            <tr>
            <th class="th-sm">Select Trip</th>
            <th class="th-sm">Date</th>
            <th >People</th>
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


  </div>
</template>


<script>

    import db from '../firebase.js';
    import { collection, doc, getDocs, getDoc, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore, onSnapshot, arrayRemove, orderBy, query} from "firebase/firestore";
    //import Navbar from '@/components/Navbar.vue';
    // const db = getFirestore(app);
    import router from "../router"
    import {getAuth, onAuthStateChanged} from 'firebase/auth'
    import '@fortawesome/fontawesome-free/css/all.css'
    import { faClone } from '@fortawesome/free-solid-svg-icons'



    export default {
        name: 'Trips',
        components: {

        },
        data() {
          return {
            userid : "",
            componentKey: 0,
            selectedSort: 'Start_Date-desc',
            sorter: "Start_Date",
            order: "desc",
            sortOptions: [
              { name: 'Name (ascending)', value: 'Name-asc' },
              { name: 'Name (descending)', value: 'Name-desc' },
              { name: 'Date (oldest first)', value: 'Start_Date-asc' },
              { name: 'Date (newest first)', value: 'Start_Date-desc' }
            ],
            numTrips: 0
          }
        },
        computed: {
          async haveTrips() {
            return this.numTrips != 0;
            // const collectionRef = getDocs(collection(db, "Trip"));
            // return collectionRef.size != 0;
          }
        },
        updated() {
          //this.displayTrips();
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
            async sortTable() {
              [this.sorter, this.order] = this.selectedSort.split("-");
              // window.location.reload();
              //this.displayTrips(sorter, order)

              let tripsTable = document.getElementById("fullTable")
              let rows = tripsTable.rows;
              for (let i = rows.length - 1; i > 0; i--) {
                tripsTable.deleteRow(i);
              }
              this.displayTrips()
            },

            async displayTrips() {
              //let allTrips = await getDocs(query(collection(db, "Trip"), orderBy("Start_Date", "desc")))
              let allTrips = await getDocs(query(collection(db, "Trip"), orderBy(this.sorter, this.order)))
              let allUsers = await getDocs(collection(db, "User"))
              let allExpenses = await getDocs(collection(db, "Expense"))
              const userRef = doc(db, 'User', this.userid);
              console.log(this.userid)
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
              this.numTrips = tripsArray.length
              Promise.all([allTrips, allUsers, allExpenses]).then(results => {
                let currentUser = this.userid
                let index = 1
                allTrips.forEach((d) => {
                  let tripCode = d.id
                  if (tripsArray.includes(tripCode)) {
                    let tripData = d.data()
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
                        namesArray.push(" " + name)
                      }
                    })

                    let tripsTable = document.getElementById("fullTable")
                    let row = tripsTable.insertRow(index)
                    row.style.height = "70px";
                    row.style.lineHeight = "1.15";
                    // row.style.maxHeight = "50px"
                    //row.style.overflow = "auto"

                    let cell1 = row.insertCell(0); cell1.style.textAlign = "center"; cell1.style.verticalAlign = "middle";
                    let cell2 = row.insertCell(1); cell2.style.textAlign = "center"; cell2.style.verticalAlign = "middle";
                    let cell3 = row.insertCell(2); cell3.style.textAlign = "center"; cell3.style.verticalAlign = "middle";
                    let cell4 = row.insertCell(3); cell4.style.textAlign = "center"; cell4.style.verticalAlign = "middle";
                    let cell5 = row.insertCell(4); cell5.style.textAlign = "center"; cell5.style.verticalAlign = "middle";
                    let cell6 = row.insertCell(5); cell6.style.textAlign = "center"; cell6.style.verticalAlign = "middle";
                    let cell7 = row.insertCell(6); cell7.style.textAlign = "center"; cell7.style.verticalAlign = "middle";
                    let cell8 = row.insertCell(7); cell8.style.textAlign = "center"; cell8.style.verticalAlign = "middle"; cell8.style.width = "210px";
                    let cell9 = row.insertCell(8); cell9.style.textAlign = "center"; cell9.style.verticalAlign = "middle";

                    let cell3Content = document.createElement('div');
                    cell3Content.classList.add('people');
                    cell3Content.innerHTML = namesArray;
                    cell3.appendChild(cell3Content);

                    const resultPromise = this.loadExpenses(tripExpenses);
                    resultPromise.then((result) => {
                      const expense = result.expense;
                      const netowe = result.netowe;
                      cell5.innerHTML = netowe;
                      cell6.innerHTML = expense; //expenses
                    });

                    cell2.innerHTML = startDate + " - " + "<br>" + endDate ;
                    //cell3.innerHTML = namesArray; //people;
                    cell4.innerHTML = currency;
                    cell7.innerHTML = budget;


                    let container = document.createElement("div");
                    //make container display flex row, elements in container display inline in a row
                    container.style.display = "flex"
                    container.style.flexDirection = "row"
                    container.style.justifyContent = "center"
                    container.style.alignItems = "center"
                    let text = document.createElement("div");
                    text.innerHTML = tripCode
                    container.style.fontSize = "11.5px"
                    const copyButton = document.createElement('button');
                    copyButton.type = 'button';
                    copyButton.style.marginLeft = "5px"
                    copyButton.style.borderRadius = "5px"
                    const icon = document.createElement('span');
                    icon.className = 'material-icons';
                    icon.textContent = 'content_copy';
                    icon.style.fontSize = "18px"

                    //hover effect for copy icon
                    icon.addEventListener("mouseover", function() {
                      icon.style.fontSize = "19px"
                      text.style.textDecoration = "underline";
                    });
                    icon.addEventListener("mouseout", function() {
                      icon.style.fontSize = "18px"
                      text.style.textDecoration = "none";
                    });

                    copyButton.style.backgroundColor = "white"
                    copyButton.style.border = "0.75px solid rgba(128, 128, 128, 0.2)";


                    copyButton.appendChild(icon);
                    //make icon be in center of copyButton
                    copyButton.style.display = "flex"
                    copyButton.style.justifyContent = "center"
                    copyButton.style.alignItems = "center"

                    container.appendChild(text);
                    container.appendChild(copyButton);
                    cell8.appendChild(container)

                    copyButton.title = "Copy"
                    copyButton.addEventListener("click", function() {
                      navigator.clipboard.writeText(tripCode);
                      cell8.textContent.style.textDecoration = "underline";
                      setTimeout(function() {
                        cell8.style.textDecoration = "none";
                      }, 1000);
                    });

                    let tripButton = document.createElement("button")
                    // tripButton.id  = String(tripName)
                    tripButton.className= "bwt"
                    tripButton.innerHTML = tripName
                    tripButton.onclick = function() {
                      //router.push('/PersonalPage')
                      try {
                        router.push({name:'Dashboard',
                        query: {
                            tripCode: tripCode, tripName: tripName, currency: currency
                          }})
                        //showTrip(tripCode)
                      } catch(e) {
                        console.error(e.message)
                      }
                    }
                    tripButton.style.backgroundColor = "#E2FAB5";
                    tripButton.style.borderRadius = "15px";
                    tripButton.style.width = "110px"
                    tripButton.style.height = "40px"

                    // tripButton.style.padding = "10px"
                    // tripButton.style.margin = "0 auto";
                    tripButton.addEventListener('mouseover', function() {
                      // tripButton.style.fontWeight = 'bold';
                      tripButton.style.backgroundColor = '#62b57d';
                    });
                    tripButton.addEventListener('mouseout', function() {
                      tripButton.style.fontWeight = 'normal';
                      tripButton.style.backgroundColor = "#E2FAB5";
                    });
                    cell1.appendChild(tripButton)


                    let deleteTripButton = document.createElement("button")
                    deleteTripButton.id = String(tripName)
                    deleteTripButton.className = "bwt"
                    deleteTripButton.style.backgroundColor = "#f76f7c";
                    deleteTripButton.style.padding = "6px";
                    deleteTripButton.style.borderRadius = "20px";
                    deleteTripButton.innerHTML = "Leave"
                    //grey out delete button if trip has already commenced
                    let date = new Date().getTime(); let parts = startDate.split("-"); let startdate = new Date(parts[0], parts[1]-1, parts[2]).getTime()
                    if (date >= startdate) {
                      deleteTripButton.style.backgroundColor = "grey"
                    }


                    cell9.appendChild(deleteTripButton)
                    deleteTripButton.onclick = async function() {
                      //deleteRow(index)
                      let date = new Date().getTime()
                      let parts = startDate.split("-")
                      let startdate = new Date(parts[0], parts[1]-1, parts[2]).getTime()
                      if (date >= startdate) { //if trip has alr commenced, cannot delete
                        console.log("cannot delete")
                        alert("You cannot delete a trip that has already commenced.")
                      } else {   //else, delete trip from user document and from trips if there are no other users involved
                        console.log("can delete")
                        alert("You are going to delete " + tripCode)
                        //await deleteDoc(doc(db, "Trip", tripCode))
                        console.log("Trip successfully deleted!", tripCode)
                        let tb = document.getElementById("fullTable")
                        for (var i = 0; i < tb.rows.length; i++) {
                          var row = tb.rows[i];
                          var value = row.cells[7].textContent.trim();
                          console.log(value.slice(0, -12))
                          if (value.slice(0, -12) == tripCode) {
                            tb.deleteRow(i);
                          }
                        }
                        let user = await getDoc(userRef)
                        user.data().Trips.forEach(trip => {
                          if (trip.Trip_Code == tripCode) {
                            updateDoc(userRef, {Trips: arrayRemove(trip)}) //delete trip from user document
                          }
                        })

                        //delete user from trip document and delete doc if no other users left in trip
                        let tripRef = doc(db, "Trip", tripCode)
                        let tripDoc = await getDoc(tripRef)
                        tripDoc.data().Users.forEach((user)=>{
                          if (user == currentUser && tripDoc.data().Users.length == 1) {
                            //delete trip doc from trips collection
                            deleteDoc(tripRef)
                            console.log("deleted trip doc")
                          } else if (user == currentUser && tripDoc.data().Users.length > 1) {
                            //remove user from trip doc
                            updateDoc(doc(db, "Trip", tripCode), {Users: arrayRemove(user)})
                            console.log("removed user from trip doc")
                          }
                        })
                      }

                    }
                    index +=1
                  }
              })
            })
            },
            refresh() {
              let tripsTable = document.getElementById("fullTable")
              let rows = tripsTable.rows;
              for (let i = rows.length - 1; i > 0; i--) {
                tripsTable.deleteRow(i);
                console.log(rows)
              }
              this.displayTrips()
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
                this.spent = expense.toFixed(2)
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
        margin: 0;
      }

      #fullTable {
        width: 90%;
        border-collapse: collapse;
        /* overflow: hidden; */
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        border-top-right-radius: 22px;
        border-top-left-radius: 22px;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
        /* table-layout: fixed; */
        position: auto;
        background-color: white;
        margin-left: 70px;
        margin-top: 30px;
        z-index: 0;
        position: relative;
      }

      th, td {
          padding: 15px;
          /* background-color: rgba(255,255,255,0.2); */
          color: black;
          font-family: Arial, Helvetica, sans-serif;
          height: 5px;
      }

      tr {
        height: 10px;
      }

      thead th {
          background-color: rgb(156, 201, 215);
          /* #55608f */
          color: black;

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


      #topBar {
        margin-bottom: 0;
        bottom: 0;
        display: inline
      }

      .people {
        max-width: 20px;
        overflow-x: auto;
      }

  select:hover {
    transform: scale(1.02); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
  }

</style>
