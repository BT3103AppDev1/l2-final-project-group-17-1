<template>
    <section style="background-color: floralwhite; height: 100%; min-height: 100vh;">
    <!-- <h1>GROUP PAGE </h1>
    <p>{{ tripCode }}</p> -->
    <div class="container" style="background-color: floralwhite;">
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
            <h2 v-show="noDebts" style = "text-align: center;">No Outstanding Debts! </h2>
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


        <h2 class="py-3 d-flex justify-content-start">Group Expenses</h2>

        <div class="scrollable">
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
                <th class="th-sm" style="color:#111;">Paid By
                </th>
                <th class="th-sm" style="color:#111;">People Involved
                </th>
                <th class="th-sm" style="color:#111;">Option
                </th>
                </tr>
            </thead>
            </table>
            <h2 v-if = "noExpenses" style=" background-color: floralwhite; text-align: center; font-family:Arial, Helvetica, sans-serif; margin-top: 35px;">No Expenses Added!</h2>
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
            budget: "",
            tripExpenses: "",
            people: "",
            oweDict: {},
            name: "",
            noExpenses: false
          }
    },

    props: {
        tripCode: String,
        tripName: String,
        currency: String,
        startDate: String,
        endDate: String
    },

    computed: {
        noDebts() {
            return Object.keys(this.oweDict).length === 0
        }
    },

    methods: {
        async deleteExpense(expenseID, tripCode, currentTripExpenses) {
            let exp = await getDoc(doc(db, "Expense", expenseID))
            let spenders = exp.data().Users
            if (spenders.includes(this.userid)) {
                console.log("you are part of this group spending")
                alert("You are going to delete " + expenseID)
                await deleteDoc(doc(db, "Expense", expenseID))
                await updateDoc(doc(db, "Trip",tripCode), {
                    Expenses: arrayRemove(expenseID)
                })
                let tb = document.getElementById("fullTable")
                while (tb.rows.length>1){
                    tb.deleteRow(1)
                }
                let currentT = await getDoc(doc(db,"Trip",tripCode))
                let currentTripE = currentT.data().Expenses

                const com = this
                await com.displayGroupExpenses(tripCode)
                // await com.loadExpenses(currentTripExpenses)
                this.oweDict = {}
                await com.loadExpenses(currentTripE)

            } else {
                alert("You cannot delete a group expense that you are not part of!")
            }


            // displayGroupExpenses(tripCode)
        },

        async displayGroupExpenses(tripCode){
            let index = 1
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
                            row.style.backgroundColor = "white";
                            let cell1 = row.insertCell(0);
                            let cell2 = row.insertCell(1);
                            let cell3 = row.insertCell(2);
                            let cell4 = row.insertCell(3);
                            let cell5 = row.insertCell(4);
                            let cell6 = row.insertCell(5);
                            let cell7 = row.insertCell(6);

                            var date = expense.data().Date
                            var amount = expense.data().Amount
                            var cat = expense.data().Category
                            var paidby = expense.data().Paid_By

                            cell1.innerHTML = date
                            cell2.innerHTML = expense.data().Description
                            cell3.innerHTML = cat
                            cell4.innerHTML = amount
                            // cell5.innerHTML = paidby
                            let paidby_name = ""
                            users.forEach((userID)=> { //for each userid in expense
                                allUsers.forEach((user)=> {
                                    if (user.id == userID) {
                                        userNames = userNames + ", " + user.data().Name
                                        // userNames = userNames.substring(1,)
                                    } if (user.id == paidby) {
                                        paidby_name = user.data().Name
                                    }
                                })
                            })
                            cell5.innerHTML = paidby_name
                            cell6.innerHTML = userNames.substring(1,)
                            let deleteExpenseButton = document.createElement("button")
                            deleteExpenseButton.id = expense.id
                            deleteExpenseButton.innerHTML = "Delete"
                            cell7.appendChild(deleteExpenseButton)
                            deleteExpenseButton.onclick =() => {
                                this.deleteExpense(expense.id, tripCode, currentTripExpenses);
                            }
                            index +=1
                        }
                    }
                })
            })
            if (index == 1) {
                    this.noExpenses = true;
                }
        },

        async loadExpenses(expRefs) {
            console.log("expRefs",expRefs)
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
                                            console.log("oweDict", this.oweDict)
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


        this.displayGroupExpenses(this.tripCode)

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
  h1, h2, h3, h4 {
    color: darkslategrey;
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
</style>
