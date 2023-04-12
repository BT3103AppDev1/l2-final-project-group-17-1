<template>
    <div class = "page">
            <loading-spinner v-if="userid != null"></loading-spinner>
            <!-- <p>{{ userid }}</p> -->
            <!-- <i class ="fa fa-spinner fa-spin"></i> Loading... -->

        <!-- <BudgetBar :tripCode = 'tripCode'/> -->
        <!-- <PersonalExp :tripCode = 'tripCode'/>  -->
        <!-- <p>tripCode is : {{tripCode}}  {{people}}</p> -->

      <!-- <div class = "container">
        <div id = "budget"> <Budget/> </div>
        <div id = "expenses"><PersonalExpenses/> </div>
      </div> -->

        <!-- Trip Name, Dropdown buttons, water tank, radio to switch indiv and group pages -->
    <div class="p-4 text-dark" id="topBar" style="background-color: floralwhite; top:0px;">
        <div class="container">
            <!-- Water tank -->
            <div class="container text-center card py-3" style="border-color: #55608f; justify-content: space-between; ">
                <div style="display: flex; flex-direction: row; margin-bottom: 10px; justify-content: space-between; ">
                    <h1 style="margin-left: 500px;">Status of Budget <h5>Currency: {{ this.currency }}</h5> </h1> 
                    <button @click = "this.showPopup = true" style=" width: 120px; border-radius: 15px; margin-left:380px; height: 55px;">Edit Budget</button>
                    <div v-if="showPopup" class="modal">
                        <div class="modal-content">
                            <input id="budgetInput" type="number" class="form-control form-control-lg" v-model="newBudget"/>
                            <label class="form-label" for="budgetInput">Edit Budget</label>
                            <button class="btn btn-lg btn-block shadow text-light" @click="showPopup = false" style="background-color: red; margin-top:40px">Cancel</button>
                            <button class="btn btn-lg btn-block shadow text-light"  style="background-color: #2196F3; margin-top:10px" @click.prevent="saveBudget">Save</button>
                        </div>
                    </div>
                </div>
                <div class="w3-light-grey w3-xlarge">
                    <div id="waterTank" class="w3-container w3-center" style=""></div>
                </div>
                <span>Total Spent: {{totalSpent}}</span>
                <span> Your Budget: {{budget}}</span>
            </div>
        </div>
    </div>
        <!-- Table with all personal expenses -->
    <!-- <section class="py-5"> -->
    <div class="container p-3" id="fullTableSection">

        <div class="d-flex justify-content-between px-3">
            <h2 class="py-3 d-flex justify-content-start">Personal Expenses</h2>

            <div class="d-flex flex-row" style="padding:0px;">
              <!-- <div class = "dropdown px-3">
                  <button class = "btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      Currency
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" href="#">SGD</a>
                      <a class="dropdown-item" href="#">Original</a>
                  </div>
                </div> -->
              </div>
          </div>
        <div class="scrollable" style="background-color: white;">
            <table id="fullTable" class="table table-striped table-bordered table-sm table-scroll text-center" cellspacing="0"
            width="100%">
              <thead style="background-color: white; font-family:Arial, Helvetica, sans-serif;">
                  <tr>
                  <th class="th-sm" style="color:#111;">Day</th>
                  <th class="th-sm" style="color:#111;">Description</th>
                  <th class="th-sm" style="color:#111;">Category</th>
                  <th class="th-sm" style="color:#111;">Cost</th>
                  <th class="th-sm" style="color:#111;">Type</th>
                  <th class="th-sm" style="color:#111;">Option</th>
                  </tr>
              </thead>
            </table>
        </div>
    </div>
    <div class="p-5" id="totalSumTable" style="background-color:floralwhite;">
        <div class = "container" style="background-color: floralwhite;">
        <MyComponent :key="componentKey" />
        <table id="dayExpenseTable" class="table table-bordered" style="background-color: white;">
            <thead style="background-color: white; font-family:Arial, Helvetica, sans-serif;">
            <tr>
                <th scope="col" style="color:black">Day</th>
                <th scope="col" style="color:black">Total Spent For Each Day</th>
            </tr>
            </thead>
        </table>
        </div>
    </div>

     <!-- Charts -->
    <!-- <section style="background-color: floralwhite;">
        <div class="container">
            <div class="d-md-flex justify-content-center">

                <div class="container text-center graph-background">
                    <h1>Proportion of Spending By Category</h1>
                    <pie-chart class ="user" width=500px :data="pieChartData" ></pie-chart >
                </div>

                <div class="container text-center graph-background">
                    <h1>Overall Spending By Category</h1>
                    <bar-chart class="user" width=500px :data="categoryDict">

                    </bar-chart>
                </div>
            </div>

            <div class="d-md-flex justify-content-center">
            <div class="container text-center graph-background">
                <h1>Spending Insights By Day</h1>
                <line-chart class ="user" width="500px" :data="spendingPerDayDict"></line-chart>
            </div></div>
        </div>
    </section> -->

    <!-- </section> -->

    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="container p-5">
                        <div class="justify-content-center">
                            <div class="container text-center graph-background justify-content-center">
                                <h1>Proportion of Spending By Category</h1>
                                <pie-chart class ="user" :data="pieChartData" ></pie-chart >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                     <div class="container p-5">
                        <div class="justify-content-center">
                            <div class="container text-center graph-background justify-content-center">
                                <h1>Overall Spending By Category</h1>
                                <bar-chart class="user" :data="categoryDict"></bar-chart>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="container p-5">
                        <div class="justify-content-center">
                            <div class="container text-center graph-background justify-content-center">
                                <h1>Spending Insights By Day</h1>
                                <line-chart class ="user" :data="spendingPerDayDict"></line-chart>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
    <span style= "background-color:black" class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
    <span style= "background-color:black" class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

    </div>
</template>

<script>
    import db from '../firebase.js';
    import Navbar from '@/components/Navbar.vue'
    import firebaseApp from '@/firebase.js'
    import {getAuth, onAuthStateChanged} from 'firebase/auth'
    import {useRoute} from 'vue-router'
    import {toRef, ref, onBeforeMount} from 'vue'
    // import PersonalExp from '@/components/PersonalExp.vue'
    // import BudgetBar from '@/components/BudgetBar.vue';
    import { arrayRemove, collection, doc, getDoc, getDocs, query, where, deleteDoc, updateDoc} from "firebase/firestore";
    import moment from 'moment'
    import LoadingSpinner from '@/components/LoadingSpinner.vue';

    export default {
    name: "PersonalPage",


    components:{
        Navbar,
        LoadingSpinner,
    },
    props: {
        tripCode: String,
        tripName: String,
        currency: String,
        startDate: String,
        endDate: String
    },
    data () {
        return {
            isLoading: true,
            user: null,
            userid: null,
            name: null,
            slide: 0,
            sliding: null,
            selected : "",
            userid : "",
            budget: "",
            tripExpenses: "",
            totalSpent: "",
            people: "",
            componentKey: 0,
            spendingPerDayDict:{},
            pieChartData: {
            "Shopping": "",
            "Food": "",
            "Leisure": "",
            "Travel": "",
            "Accomodation":"",
            },
            categoryDict: {
            "Shopping": 0,
            "Food": 0,
            "Leisure": 0,
            "Travel": 0,
            "Accomodation":0,
            },
            categoryPercentageDict:{
            "Shopping": 0,
            "Food": 0,
            "Leisure": 0,
            "Travel": 0,
            "Accomodation":0,
            },
            showPopup: false,
            newBudget: "",
            spent: 0
        }
    },
    created() {
        this.updateCharts()
        this.getBudget()
        this.getTripExpenses()
        this.getSpendingPerDayDict()
    },
    methods: {
        async deleteExpense(expenseID, tripCode) {
            alert("You are going to delete " + expenseID)
            await deleteDoc(doc(db, "Expense", expenseID))
            await updateDoc(doc(db, "Trip",tripCode), {
                Expenses: arrayRemove(expenseID)
            })
            let tb = document.getElementById("fullTable")
            while (tb.rows.length>1){
                tb.deleteRow(1)
            }
            const com = this
            await com.fetchAndUpdateData(tripCode)
            await this.updateCharts()
            // location.reload()
            // this.updateCharts()
        },
        async fetchAndUpdateData(tripCode){
            //console.log(this.spendingPerDayDict)
        
            let index = 1
            // let index2 = 1
            //const auth=getAuth()
    
            //const uid = auth.currentUser.uid
            const uid = this.userid
            
            //tripExpenses = JSON.parse(tripExpenses)
            var budget = 0;
            let currentUser = await getDoc(doc(db, "User", uid))
            let currentUserTrips = currentUser.data().Trips //trips the user is involved in
            currentUserTrips.forEach((trip)=> {
                if(trip.Trip_Code == tripCode) {
                    budget = trip.Budget
                    //budgetInput.value = this.budget //add to input field for update budget
                }
            })
            var totalCost = 0
            //DICTIONARY FOR DAILY SPENDINGS
            var spendingPerDayDict = {}
            let days = []
            let currentTrip = await getDoc(doc(db, "Trip", tripCode))
            const startDate = moment(currentTrip.data().Start_Date);
            const endDate = moment(currentTrip.data().End_Date);
            var Difference_In_Days = endDate.diff(startDate, 'days')
            let d = startDate
            days.push(d.format('YYYY-MM-DD')) //start date
            for (var i = 0; i < Difference_In_Days; i++) {
                d = d.add(1, 'days')
                //var d = new Date();
                //d.setDate(startDate.toDate() + i + 1);
                days.push(d.format('YYYY-MM-DD'));
            }
            days.forEach((day)=> {
                spendingPerDayDict[day] = 0
            })

            //DICTIONARY FOR SPENDINGS BY CATEGORY
            var categoryDict = {
                "Shopping":0,
                "Food": 0,
                "Leisure":0,
                "Travel":0,
                "Accomodation":0
            }

            let currentTripExpenses = currentTrip.data().Expenses //all expenses of this specific trip (string)
            let allExpenses = await getDocs(collection(db, "Expense")) //all expenses
            allExpenses.forEach((expense) => {
                let users = expense.data().Users;
            if (users.includes(String(uid)) && currentTripExpenses.includes(expense.id)) {
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

                totalCost += (Number(amount)/users.length)
                
                var x = Number((amount/users.length).toFixed(2))
                
                //DATA FOR DAILY SPENDINGS

                if (date in spendingPerDayDict===false) {
                    console.log(typeof(x))
                    spendingPerDayDict[date] = x
                } else {
                    console.log(typeof(x))
                    spendingPerDayDict[date] += x
                }

                // categoryDict[cat] += amount


                if (users.length>1) {
                    cell5.innerHTML = "Group"
                } else {
                    cell5.innerHTML = "Individual"
                }
                let deleteExpenseButton = document.createElement("button")
                deleteExpenseButton.id = expense.id
                deleteExpenseButton.innerHTML = "Delete"
                cell6.appendChild(deleteExpenseButton)
                deleteExpenseButton.onclick = () => {
                    this.deleteExpense(expense.id, tripCode)
                }
                index +=1
            }
            })
            var waterTankNum = 0
            var waterTank = document.getElementById("waterTank")
            // console.log('TOTALCOST', totalCost)
            // console.log("SPENDING DICT", spendingPerDayDict)
            // console.log("CAT DICT", categoryDict)
            this.spent = totalCost
            if (totalCost > budget) {
                waterTank.style.backgroundColor = "red"
                waterTankNum = ((totalCost - budget)/budget) * 100
                console.log("EXCEED BUDGET")
                waterTank.innerHTML = "EXCEED BY " + Math.ceil(waterTankNum) + "%"
                if (waterTankNum>100) {
                    waterTank.style.width = 100 + "%"
                }

            } else {
                waterTank.style.backgroundColor = "green"
                console.log("TOTALCOST",totalCost)
                waterTankNum = totalCost/budget * 100
                waterTank.innerHTML = Math.ceil(waterTankNum) + "%"
                waterTank.style.width = waterTankNum + "%"

            }
        
            let dayExpenseTable = document.getElementById("dayExpenseTable")
            let index2 = 1
            while (dayExpenseTable.rows.length > 1) {
                dayExpenseTable.deleteRow(1);
            }
            for (var day in spendingPerDayDict) {
                // console.log(dayExpenseTable.rows.length)
                var dayExpense = spendingPerDayDict[day]
                if (dayExpense == 0) {
                    continue;
                }
                let dayRow = dayExpenseTable.insertRow(index2)
                let dayCell1 = dayRow.insertCell(0);
                let dayCell2 = dayRow.insertCell(1);
                dayCell1.innerHTML = day
                dayCell2.innerHTML = dayExpense
                index2 += 1
            }
            // for (var cat in categoryDict) {
            //     var catExpense = categoryDict[cat]
            //     this.pieChartData = {
            //         cat:catExpense
            //     }
            // }
            // this.categoryDict = categoryDict

            // this.pieChartData = {
            //     "Shopping": categoryDict["Shopping"],
            //     "Food": categoryDict["Food"],
            //     "Leisure": categoryDict["Leisure"],
            //     "Travel": categoryDict["Travel"],
            //     "Accomodation": categoryDict["Accomodation"]
            // }

         

            // this.updatePieChart(categoryDict)
            // this.updateCharts()
            this.spendingPerDayDict = spendingPerDayDict
            return totalCost
        } ,

        onSlideStart(slide) {
            this.sliding = true
        },
         onSlideEnd(slide) {
            this.sliding = false
        },
        async updateCharts() {
            //Pie chart
            let trip = await getDoc(doc(db, "Trip", this.tripCode))
            let currentTripExpenses = trip.data().Expenses
            let uid = this.userid
            let categoryDict = {
                "Shopping":0,
                "Food": 0,
                "Leisure": 0,
                "Travel": 0,
                "Accomodation":0,
            }
            let categoryPercentageDict = {
                "Shopping":0,
                "Food": 0,
                "Leisure": 0,
                "Travel": 0,
                "Accomodation":0,
            }
            let formattedForPieChart = {
            "Shopping": "",
            "Food": "",
            "Leisure": "",
            "Travel": "",
            "Accomodation":"",
            }
            //let catergories = ["Shopping", "Food"]
            let allExpenses = await getDocs(collection(db, "Expense")) //all expenses
            var totalAmountPersonal = 0
            allExpenses.forEach((expense) => {
                let users = expense.data().Users;
            if (users.includes(this.userid) && currentTripExpenses.includes(expense.id)) {
                let cat = expense.data().Category
                let amt = expense.data().Amount
                if (users.length>1) {
                    amt = amt/users.length
                }
                totalAmountPersonal += amt
                categoryDict[cat] += amt.toFixed(2)
                for (let c in categoryPercentageDict) {
                    if (c == cat) {
                        categoryPercentageDict[cat] = (categoryDict[cat]/totalAmountPersonal)*100
                        formattedForPieChart[cat] = String(categoryPercentageDict[cat].toFixed(2)) + "%"
                    } else {
                        categoryPercentageDict[c] = (categoryDict[c]/totalAmountPersonal)*100
                        formattedForPieChart[c] = String(categoryPercentageDict[c].toFixed(2)) + "%"
                    }
                }
                //categoryPercentageDict[cat] = (categoryDict[cat]/totalAmount)*100
                //formattedForPieChart[cat] = String(categoryPercentageDict[cat].toFixed(2)) + "%"
                // console.log(formattedForPieChart)
                }
            })
            this.categoryDict = categoryDict
            this.categoryPercentageDict = categoryPercentageDict
            this.pieChartData = formattedForPieChart
            this.totalSpent = "$" + totalAmountPersonal.toFixed(2)
            //console.log(this.categoryDict)
            // if (this.totalSpent > this.budget) {
            //     var bar = document.getElementById("waterTank")
            //     bar.style.backgroundColor = "red"
            //     console.log("EXCEED BUDGET")
            // }
        },
        forceRerender() {
            this.componentKey += 1;
        },
        async getTripExpenses() {
            let trip = await getDoc(doc(db, "Trip", this.tripCode))
            this.tripExpenses = trip.data().Expenses
        },
        async getBudget() {
            const auth = getAuth()
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.userid = user.uid
                    let currentUser = await getDoc(doc(db, "User", this.userid))
                    let currentUserTrips = currentUser.data().Trips
                    currentUserTrips.forEach((trip)=> {
                        if(trip.Trip_Code == this.tripCode) {
                            let tripBudget = parseFloat(trip.Budget).toFixed(2)
                            this.budget = "$" + tripBudget
                        }
                    })
                }
            })
        },
        async getSpendingPerDayDict() {
            //DICTIONARY FOR DAILY SPENDINGS
            const auth=getAuth()
            //const uid = auth.currentUser.uid
            const uid = this.userid
            var spendingPerDayDict = {}
            let days = []
            let currentTrip = await getDoc(doc(db, "Trip", this.tripCode))
            const startDate = moment(currentTrip.data().Start_Date);
            const endDate = moment(currentTrip.data().End_Date);
            var Difference_In_Days = endDate.diff(startDate, 'days')
            let d = startDate
            days.push(d.format('YYYY-MM-DD')) //start date
            for (var i = 0; i < Difference_In_Days; i++) {
                d = d.add(1, 'days')
                //var d = new Date();
                //d.setDate(startDate.toDate() + i + 1);
                days.push(d.format('YYYY-MM-DD'));
            }
            days.forEach((day)=> {
                spendingPerDayDict[day] = 0
            })

            let currentTripExpenses = currentTrip.data().Expenses //all expenses of this specific trip (string)
            let allExpenses = await getDocs(collection(db, "Expense")) //all expenses
            allExpenses.forEach((expense) => {
                let users = expense.data().Users;
                if (users.includes(this.userid) && currentTripExpenses.includes(expense.id)) {
                    var date = expense.data().Date
                    var amount = expense.data().Amount

                    //DATA FOR DAILY SPENDINGS
                    if (date in spendingPerDayDict===false) {
                        spendingPerDayDict[date] = (amount/users.length).toFixed(2)
                    } else {
                        spendingPerDayDict[date] += (amount/users.length).toFixed(2)
                    }
                }
            })
            this.spendingPerDayDict = spendingPerDayDict
            //console.log(this.spendingPerDayDict)
            //console.log("method called")
        },

        async saveBudget() {
            if (Number.isInteger(this.newBudget) && this.newBudget > 0) {
                const userRef = doc(db, "User", this.userid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    let userTrips = docSnap.data().Trips
                    for (var i = 0; i < userTrips.length; i++) {
                        if (userTrips[i].Trip_Code == this.tripCode) {
                            userTrips[i].Budget = this.newBudget
                            this.budget = "$" + parseFloat(this.newBudget).toFixed(2)
                            await updateDoc(userRef, {
                                Trips: userTrips
                            }).then(() => {
                                alert("Budget Updated Successfully!")
                            })
                        }
                    }
                }
                this.showPopup = false;
            } else {
                alert("Please enter a valid budget!")
            }
            var waterTankNum = 0
            var waterTank = document.getElementById("waterTank")  
            let totalCost =  this.spent
            if (totalCost > this.newBudget) {
                waterTank.style.backgroundColor = "red"
                waterTankNum = ((totalCost - this.newBudget)/this.newBudget) * 100
                console.log("EXCEED BUDGET")
                waterTank.innerHTML = "EXCEED BY " + Math.ceil(waterTankNum) + "%"
                if (waterTankNum>100) {
                    waterTank.style.width = 100 + "%"
                }

            } else {
                waterTank.style.backgroundColor = "green"
                //console.log("TOTALCOST",totalCost)
                waterTankNum = totalCost/this.newBudget * 100
                waterTank.innerHTML = Math.ceil(waterTankNum) + "%"
                waterTank.style.width = waterTankNum + "%"

            }
        }
    },

    async mounted() {
        try { const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
        if (user) {
            this.user = user
            this.userid = user.uid
            console.log(this.userid)
            this.name = user.Name
            this.isLoading = false
            //this.getBudget()
            this.spent = this.fetchAndUpdateData(this.tripCode)
        } else {
            this.userid = undefined
        }
        })
        } catch(error) {
            console.log("error authenticating")
        }
        // console.log(this.userid===undefined)
        // console.log(this.userid)
       
        // this.updatePieChart(this.categoryDict)
        //this.spent = await fetchAndUpdateData(this.tripCode) 
        // var input = document.getElementById("budgetInput")
        // input.value = this.budget

    } 
    } 
</script> 
    
    <style scoped>

        .page {
            background-color: floralwhite;
            min-height: 100vh;
        }
           table {
              width: 1300px;
              /* width:1000px; */
              border-collapse: collapse;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              border-top-right-radius: 25px;
              border-top-left-radius: 25px;
              border-bottom-right-radius: 25px;
              border-bottom-left-radius: 25px;
              text-align: center;
          }

          th,
          td {
              padding: 15px;
              background-color: rgba(255,255,255,0.2);
              color: black;
          }

          thead th {
              /* background-color: #55608f; */
              background-color: rgb(156, 201, 215);

          }

          #fullTableSection h1 {
                color: #111;
                font-family: 'Helvetica Neue', sans-serif;
                font-size: 50px;
                font-weight: bold;
                letter-spacing: -1px;
                line-height: 1;
                text-align: center;
          }

          th {
              text-align: center;
              color:white;
          }

        .graph-background {
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 20px;
        }

        .modal {
            display: block;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 30%;
        }

        .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus, .save {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }
    </style>
