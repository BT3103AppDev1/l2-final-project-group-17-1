<template>
    <section style="background-color: floralwhite;">
    <h1>GROUP PAGE </h1>
    <p>{{ tripCode }}</p>
    <div class="container" style="background-color: floralwhite;">
            <div class="d-flex justify-content-between">
                <div class="text-center py-5" style= "width: 40rem;">
                    <div id="tripName" class="card-body px-5" style="text-align:justify; padding:0px">
                      <!-- <img src="globe.png" style="float:left;" width="120" height="auto">  -->
                      <h1>Trip to {{ tripName }}</h1>
                      <span style="font-family:monospace;">{{ startDate }} - {{endDate}}</span>
                    </div>
                </div>
                <div class="d-flex flex-columnn">
                    <button class = "btn btn-light" id = "Personal" @click="redirectToPersonal()"><b>Personal</b></button>
                    </div>
            </div>

    <section class="container p-3" >
        <h2 class="py-3">Outstanding Payments</h2>
        <h6>Owed to You: {{ currency }}</h6>
        <div class="scrollable">
            <table id="fulltable" class="table-sm table table-bordered table-scroll text-center" cellspacing="0"
            width="80%" style="background-color: white; color:#111; margin-top: 20px;">
            <thead style="background-color: rgb(156, 201, 215); font-family:Arial, Helvetica, sans-serif;"> 
                <tr>
                <th v-for="(value, user) in oweDict" :key="user" class="th-sm" style="color: #111;" > {{ user }}</th>
                </tr>
            </thead>
                <tr>
                    <td v-for="user in oweDict" :key="user">{{ user.toFixed(2) }}</td>
                </tr>
            </table>
        </div>
    </section>
    <!-- <div>
        <h2>Debts</h2>
        <ul>
        <li v-for="(user, amount) in oweDict" :key="user">
            {{ user }}: {{ amount }}
            {{ user }}: {{ calculateOwedAmount(user) }} 
        </li>
        </ul>
  </div> -->
        
            <!-- Table with all group expenses -->
    <section class="container p-3" id="fullTableSection" style="background-color: floralwhite;"> 
        
        <div class="d-flex justify-content-between px-3">
            <h2 class="py-3 d-flex justify-content-start">Group Expenses</h2>
    
            <div class="d-flex flex-row" style="padding:0px;">
              <div class = "dropdown px-3">
                  <button class = "btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      Currency
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" href="#">SGD</a>
                      <a class="dropdown-item" href="#">Original</a>
                  </div>
                </div>
              </div>
          </div>
        <div class="scrollable" style="background-color: white;">
            <table id="fullTable" class="table table-striped table-bordered table-sm table-scroll text-center" cellspacing="0"
            width="100%">
            <thead style="background-color: rgb(156, 201, 215); font-family:Arial, Helvetica, sans-serif;">
                <tr>
                <th class="th-sm" style="color:#111;">Day
                </th>
                <th class="th-sm" style="color:#111;">Description
                </th>
                <th class="th-sm" style="color:#111;">Category
                </th>
                <th class="th-sm" style="color:#111;">Cost
                </th>
                <th class="th-sm" style="color:#111;">People Involved
                </th>
                <th class="th-sm" style="color:#111;">Option
                </th>
                </tr>
            </thead>

            </table>
        </div>
    </section>
            </div>
        </section>
</template>

<script>
    import db from '../firebase.js';
    import Navbar from '@/components/Navbar.vue'
    import {getAuth, onAuthStateChanged} from 'firebase/auth'
    import { collection, doc, getDocs, getDoc, query, where} from "firebase/firestore";
    import moment from 'moment'

export default {
    name: "GroupPage",
    components:{
        Navbar,
    },
    data() {
          return {
            userid : "",
            tripCode: this.$route.query.tripCode,
            budget: "",
            tripName: this.$route.query.tripName,
            startDate: "",
            endDate: "",
            tripExpenses: "",
            people: "",
            currency: this.$route.query.currency,
            oweDict: {},
            name: ""
          }  
    },

    created() {
        this.getStartDate(),
        this.getEndDate()
    },

    methods: {
        async getStartDate() {
            let trip = await getDoc(doc(db, "Trip", this.tripCode))
            this.startDate = moment(trip.data().Start_Date).format('DD/MM/YYYY')
        },
        async getEndDate() {
            let trip = await getDoc(doc(db, "Trip", this.tripCode))
            this.endDate = moment(trip.data().End_Date).format('DD/MM/YYYY')
        },
        redirectToPersonal() {
            this.$router.push({name:'PersonalPage', query:{
            tripCode: this.tripCode, tripName: this.tripName, currency: this.currency}})
        },
        async loadExpenses(expRefs) {
            console.log(expRefs)
            let allUsers = await getDocs(collection(db, "User"))
              try {
                for (const expRef of expRefs) {
                  const docRef = doc(db, "Expense", expRef);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                    const exp = docSnap.data()
                    if (exp.Users.includes(this.userid)) {
                        let people = exp.Users //array
                        if (exp.Paid_By == this.userid) {
                            for (const userRef of people) {
                                if (userRef != this.userid) {
                                console.log(allUsers)
                                    allUsers.forEach((user) => {
                                        if (user.id == userRef) {
                                            let username = user.data().Name
                                            if (!(username in this.oweDict)) {
                                                this.oweDict[username] = 0
                                            }
                                            this.oweDict[username] += exp.Amount / people.length
                                        }
                                    })
                                }
                            }
                        } else {
                            let userRef = exp.Paid_By
                            allUsers.forEach((user) => {
                                if (user.id == userRef) {
                                    let username = user.data().Name
                                    if (!(username in this.oweDict)) {
                                        this.oweDict[username] = 0
                                    }
                                    this.oweDict[username] -= exp.Amount / people.length
                                }
                            })
                            // if (!(username in this.oweDict)) {
                            //     this.oweDict[username] = 0
                            // }
                            // this.oweDict[username] -= exp.Amount / people.length
                        }
                    }
                  }
                }
                delete this.oweDict[this.name]
                console.log(this.oweDict)
                // const result = {expense: expense.toFixed(2),
                //                 netowe: netowe.toFixed(2)}
            } catch (error) {
                console.log("Error calculating money owed", error);
            }
        }
    },

    mounted() {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
            this.user = user
            this.userid = user.uid
            this.name = user.Name
            }
            else {
            console.log("logged out")
            }
        })
        //console.log(this.$route.query.tripCode)
        async function displayDates(tripCode) {
        }
        // console.log(this.tripCode)
        // async function calculateOweAmount(tripCode) {
        //     let currentTrip = await getDoc(doc(db, "Trip", tripCode)) 
        //     let currentTripExpenses = currentTrip.data().Expenses
        //     this.loadExpenses(currentTripExpenses)
        // }
        //calculateOweAmount(this.tripCode);
        async function getExpenses(tripCode){
            let currentTrip = await getDoc(doc(db, "Trip", tripCode)) 
            let currentTripExpenses = currentTrip.data().Expenses 
            console.log(currentTripExpenses)
            return currentTripExpenses
        }
        getExpenses(this.tripCode).then((result) => {
            this.loadExpenses(result);
            //console.log(this.oweDict)
        })
        async function displayGroupExpenses(tripCode){
            let index = 1
            let index2 = 1
            const auth=getAuth()
            //const uid = auth.currentUser.uid
            let currentTrip = await getDoc(doc(db, "Trip", tripCode)) 
            let currentTripExpenses = currentTrip.data().Expenses //all expenses of this specific trip
            let allExpenses = await getDocs(collection(db, "Expense")) //all expenses
            let allUsers = await getDocs(collection(db, "User"))
            
            var totalCost = 0
            var spendingPerDayDict = {}
            var categoryDict = {
                "Shopping":0,
                "Food": 0,
                "Leisure":0,
                "Travel":0,
                "Accomodation":0
            }
            console.log(currentTripExpenses)
            // this.loadExpenses(currentTripExpenses)
            currentTripExpenses.forEach((expenseID) => { //for each expenseID in trip, get expense data
                let userNames = ""
                allExpenses.forEach((expense)=> {
                    if (expenseID == expense.id) {
                        let users = expense.data().Users; //array of user ids (string)
                        //console.log(expense.id)
                        if (users.length > 1) {
                            let expenseTable = document.getElementById("fullTable")
                            let row = expenseTable.insertRow(index)
                            let cell1 = row.insertCell(0);
                            let cell2 = row.insertCell(1);
                            let cell3 = row.insertCell(2);
                            let cell4 = row.insertCell(3);
                            let cell5 = row.insertCell(4);
                            let cell6 = row.insertCell(5);

                            var date = expense.data().Date
                            var amount = expense.data().Amount
                            var cat = expense.data().Category
                            cell1.innerHTML = date
                            cell2.innerHTML = expense.data().Description
                            cell3.innerHTML = cat
                            cell4.innerHTML = amount
                            users.forEach((userID)=> { //for each userid in expense
                                allUsers.forEach((user)=> {
                                    if (user.id == userID) {
                                        userNames = userNames + ", " + user.data().Name
                                        userNames = userNames.substring(1,)
                                    }
                                })
                            })
                            cell5.innerHTML = userNames
                            let deleteExpenseButton = document.createElement("button")
                            cell6.appendChild(deleteExpenseButton)
                            index +=1
                        }
                    }
                })
            
            })
            }
        displayGroupExpenses(this.tripCode)
    },
    // methods: {
    //     async getUserNames(users) {
    //         let userNames = ""
    //         let allUsers = await getDocs(collection(db, "User"))
    //         users.forEach((userID)=> { //for each userid in expense
    //             allUsers.forEach((user)=> {
    //                 if (user.id == userID) {
    //                     userNames = userNames + " " + user.data().Name
    //                 }
    //             })
    //         })
    //         return userNames
    //     }, 
    // }


}
</script>


<style>
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
        th,
        td {
            padding: 15px;
            background-color: rgba(255,255,255,0.2);
            color: black
        }

        thead th {
            background-color: #3d6d9e;

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

        #fulltable {
          justify-content: space-between;
          text-align: center;
          table-layout: fixed;
          width: 80%;
          border-radius: 25px;
          margin-left: auto;
          margin-right: auto;
        }
</style>