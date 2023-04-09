<template>
    <section style="background-color: floralwhite; height: 100%; min-height: 100vh;">
    <!-- <h1>GROUP PAGE </h1>
    <p>{{ tripCode }}</p> -->
    <div class="container" style="background-color: floralwhite;">
            <div class="d-flex justify-content-between">
                <div class="text-center py-5" style= "width: 40rem;">
                    <div id="tripName" class="card-body px-5" style="text-align:justify; padding:0px">
                      <img src="src/assets/images/globe.png" style="float:left;" width="120" >
                      <h1>Trip to {{ tripName }}</h1>
                      <span style="font-family:monospace;">{{ startDate }} - {{endDate}}</span>
                    </div>
                </div>
                <input type="checkbox" id="switch" class="inputbtn" @click="redirectToPersonal()" /><label for="switch" class="labelbtn"><h1>Group</h1></label>
            </div>

    <div class="container p-5" >
        <h2 class="py-3">Outstanding Debts</h2>
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
                    <td v-for="(value, user) in oweDict" :key="user">{{ value.toFixed(2) }}</td>
                </tr>
            </table>
            <h1 v-show="noDebts" style = "text-align: center;">No Outstanding Debts! </h1>
        </div>
      </div>
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
    <div class="container p-5" id="fullTableSection" style="background-color: floralwhite;">

        <div class="d-flex justify-content-between px-3">
            <h2 class="py-3 d-flex justify-content-start">Group Expenses</h2>

            <div class="d-flex flex-row" style="padding:0px;">
              <div class = "dropdown px-3">
                  <!-- <button class = "btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      Currency
                  </button> -->
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" href="#">SGD</a>
                      <a class="dropdown-item" href="#">Original</a>
                  </div>
                </div>
              </div>
          </div>
        <div class="scrollable" style="background-color: white;">
            <table id="fullTable" class="table table-striped table-bordered table-sm table-scroll text-center" cellspacing="0"
            width="100%" style="background-color: white; color:#111; margin-top: 20px;">
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
      </div>
            </div>
        </section>
</template>

<script>
    import db from '../firebase.js';
    import Navbar from '@/components/Navbar.vue'
    import {getAuth, onAuthStateChanged} from 'firebase/auth'
    import { collection, doc, getDocs, getDoc, deleteDoc, arrayRemove, updateDoc, query, where} from "firebase/firestore";
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

    computed: {
        noDebts() {
            return Object.keys(this.oweDict).length === 0
        }
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
                        }
                    }
                  }
                }
                delete this.oweDict[this.name]
                console.log(this.oweDict)
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
            else { //redirect to login page if not logged in
              this.$router.push('/')
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
                                        // userNames = userNames.substring(1,)
                                    }
                                })
                            })
                            cell5.innerHTML = userNames.substring(1,)
                            let deleteExpenseButton = document.createElement("button")
                            deleteExpenseButton.id = expense.id
                            deleteExpenseButton.innerHTML = "Delete"
                            cell6.appendChild(deleteExpenseButton)
                            deleteExpenseButton.onclick = function() {
                                deleteExpense(expense.id, tripCode);
                            }
                            index +=1
                        }
                    }
                })

            })
            }
        displayGroupExpenses(this.tripCode)
        async function deleteExpense(expenseID, tripCode) {
            alert("You are going to delete " + expenseID)
            await deleteDoc(doc(db, "Expense", expenseID))
            await updateDoc(doc(db, "Trip",tripCode), {
                Expenses: arrayRemove(expenseID)
            })
            let tb = document.getElementById("fullTable")
            while (tb.rows.length>1){
                tb.deleteRow(1)
            }
            displayGroupExpenses(tripCode)
        }
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
            background-color: white;
            color: black
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


        thead th {
              /* background-color: #55608f; */
              background-color: rgb(156, 201, 215);

          }
        td {
            background-color: white;
        }
        #fulltable {
          justify-content: space-between;
          text-align: center;
          table-layout: fixed;
          width: 80%;
          border-radius: 25px;
          margin-left: auto;
          margin-right: auto;
          color: white;
          background-color: white;
        }

        .inputbtn[type=checkbox]{
            height: 0;
            width: 0;
            visibility: hidden;
        }

        .labelbtn {
            cursor: pointer;
            /* text-indent: -9999px; */
            width: 200px;
            height: 80px;
            background: rgb(241, 126, 241);
            display: block;
            border-radius: 100px;
            position: relative;
            margin-top: 30px;
        }

        .labelbtn h1 {
            position: absolute;
            top: 40%;
            left: 72%;
            transform: translate(-50%, -50%);
            z-index: 1;
            font-size:23px;
            color: white;
        }

        .labelbtn:after {
            content: '';
            position: absolute;
            top: 5px;
            left: 5px;
            width: 90px;
            height: 70px;
            background: #fff;
            border-radius: 90px;
            transition: 0.3s;
        }

        .inputbtn:checked + .labelbtn {
            background: #bada55;
        }

        .inputbtn:checked + .labelbtn:after {
            left: calc(100% - 5px);
            transform: translateX(-100%);
        }

        .labelbtn:active:after {
            width: 130px;
        }

</style>
