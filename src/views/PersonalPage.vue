<template>
    <div class = "page">
        <router-view></router-view>
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
            <div class="d-flex justify-content-between">
                <!-- TripName -->
                <div class="text-center py-5" style= "width: 40rem;">
                    <div id="tripName" class="card-body px-5" style="text-align:justify; padding:5px">
                        <img src="globe.png" style="float:left;" width="120" height="auto"> 
                        <h1>Trip to {{tripName}}</h1>
                        <span style="font-family:monospace;">{{startDate}} - {{endDate}}</span>
                    </div>
                </div>

                <div class="d-flex justify-content-end p-5">
                    <input type="checkbox" id="switch" class="inputbtn" @click="redirectToGroup()" /><label for="switch" class="labelbtn"><h1>Personal</h1></label>
                </div>
            </div>
            <!-- Water tank -->
            <div class="container text-center card py-3" style="border-color: #55608f;">
                <div style="display: flex; flex-direction: row; margin-bottom: 10px;">
                    <h1 style="margin-left: 500px;">Status of Budget</h1>
                    <button @click = "editBudget" style=" width: 150px; border-radius: 15px; margin-left:350px;">Edit Budget</button>
                </div>
                <div class="w3-light-grey w3-xlarge">
                    <div id="waterTank" class="w3-container w3-green w3-center" style=""></div>
                </div>
                <span>Total Spent: {{totalSpent}}</span>
                <span> Your Budget: {{budget}}</span>
            </div>
        </div>
    </div>
        <!-- Table with all personal expenses -->
    <section class="py-5">
    <div class="container p-3" id="fullTableSection"> 
        
        <div class="d-flex justify-content-between px-3">
            <h2 class="py-3 d-flex justify-content-start">Personal Expenses</h2>
    
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
            <thead style="background-color: white; font-family:Arial, Helvetica, sans-serif;">
                <tr>
                <th class="th-sm" style="color:#111;">Day
                </th>
                <th class="th-sm" style="color:#111;">Description
                </th>
                <th class="th-sm" style="color:#111;">Category
                </th>
                <th class="th-sm" style="color:#111;">Cost
                </th>
                <th class="th-sm" style="color:#111;">Type
                </th>
                <th class="th-sm" style="color:#111;">Option
                </th>
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
    <section style="background-color: floralwhite;">
        <div class="container">
            <div class="d-md-flex justify-content-center">
                <!-- Pie Chart -->
                <div class="container text-center">
                    <h1>Proportion of Spending By Category</h1>
                    <pie-chart class ="user" width=500px :data="pieChartData" ></pie-chart >
                </div>
                 
                <!-- Bar Chart -->
                <div class="container text-center">
                    <h1>Overall Spending By Category</h1>
                    <bar-chart class="user" width=500px :data="categoryDict">

                    </bar-chart>
                </div> 
            </div>
            <!-- Line Chart -->
            <div class="d-md-flex justify-content-center">
            <div class="container text-center">
                <h1>Spending Insights By Day</h1>
                <line-chart class ="user" width="500px" :data="spendingPerDayDict"></line-chart>
            </div></div>
        </div>
    </section>

    </section>


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
    import { collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
    import moment from 'moment'

    export default {
    name: "PersonalPage",
    

    components:{
        Navbar,
    },
    data () {
        return {
            userid : "",
            tripCode: this.$route.query.tripCode,
            budget: "",
            tripName: this.$route.query.tripName,
            startDate: "",
            endDate: "",
            tripExpenses: "",
            totalSpent: "",
            people: "",
            currency: this.$route.query.currency,
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
            }
            
        } 
    },
    created() {
        this.getStartDate(),
        this.getEndDate(),
        this.updateCharts()
        this.getBudget()
        this.getTripExpenses()
        this.getSpendingPerDayDict()
    },
    methods: { 
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
            var totalAmount = 0
            allExpenses.forEach((expense) => {
                let users = expense.data().Users;
            if (users.includes(String(uid)) && currentTripExpenses.includes(expense.id)) {
                let cat = expense.data().Category
                let amt = expense.data().Amount
                totalAmount += amt
                categoryDict[cat] += amt
                for (let c in categoryPercentageDict) {
                    if (c == cat) {
                        categoryPercentageDict[cat] = (categoryDict[cat]/totalAmount)*100
                        formattedForPieChart[cat] = String(categoryPercentageDict[cat].toFixed(2)) + "%"
                    } else {
                        categoryPercentageDict[c] = (categoryDict[c]/totalAmount)*100
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
            this.totalSpent = "$" + totalAmount
            //console.log(this.categoryDict)
        },
        forceRerender() {
            this.componentKey += 1;
        },
        async getStartDate() {
            let trip = await getDoc(doc(db, "Trip", this.tripCode))
            this.startDate = moment(trip.data().Start_Date).format('DD/MM/YYYY')
        },
        async getEndDate() {
            let trip = await getDoc(doc(db, "Trip", this.tripCode))
            this.endDate = moment(trip.data().End_Date).format('DD/MM/YYYY')
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
                            this.budget = "$" + trip.Budget
                        }
                    })
                }
            })
        },
        redirectToGroup() {
            this.$router.push({name:'GroupPage', query:{
                tripCode: this.tripCode, tripName: this.tripName, currency: this.currency}})
        },  
        async getSpendingPerDayDict() {
            //DICTIONARY FOR DAILY SPENDINGS
            const auth=getAuth()
            const uid = auth.currentUser.uid
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
                if (users.includes(String(uid)) && currentTripExpenses.includes(expense.id)) {
                    var date = expense.data().Date
                    var amount = expense.data().Amount

                    //DATA FOR DAILY SPENDINGS 
                    if (date in spendingPerDayDict===false) {
                        spendingPerDayDict[date] = amount
                    } else {
                        spendingPerDayDict[date] += amount
                    }
                }
            })
            this.spendingPerDayDict = spendingPerDayDict
            //console.log(this.spendingPerDayDict)
            //console.log("method called")
        },

        //getDays() {
        //     // let days = []
        //     // var date1 = this.startDate;
        //     // var date2 = this.endDate;
        //     // var Difference_In_Time = date2.getTime() - date1.getTime();
        //     // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        //     // for (var i = 0; i < Difference_In_Days; i++) {
        //     //     var d = new Date();
        //     //     d.setDate(date1.getDate() + i + 1);
        //     //     days.push(d);
        //     // }
        //     console.log(this.startDate)
        // }
    },

    async mounted() {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
        if (user) {
            this.user = user
            this.userid = user.uid
            this.name = user.Name
            //this.getBudget()
        }
        })

        async function fetchAndUpdateData(tripCode){
            //console.log(this.spendingPerDayDict)
            let index = 1
            // let index2 = 1
            const auth=getAuth()
            const uid = auth.currentUser.uid
            //tripExpenses = JSON.parse(tripExpenses)
            var budget = 0;
            let currentUser = await getDoc(doc(db, "User", uid))
            let currentUserTrips = currentUser.data().Trips //trips the user is involved in
            currentUserTrips.forEach((trip)=> {
                if(trip.Trip_Code == tripCode) {
                    budget = trip.Budget
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

                totalCost += Number(amount)


                //DATA FOR DAILY SPENDINGS 

                if (date in spendingPerDayDict===false) {
                    spendingPerDayDict[date] = amount
                } else {
                    spendingPerDayDict[date] += amount
                }

                // categoryDict[cat] += amount
               

                if (users.length>1) {
                    cell5.innerHTML = "Group"
                } else {
                    cell5.innerHTML = "Individual"
                }
                let deleteExpenseButton = document.createElement("button")
                cell6.appendChild(deleteExpenseButton)
                index +=1
            }
            })
            var waterTankNum = totalCost/budget * 100
            var waterTank = document.getElementById("waterTank")
            // console.log('TOTALCOST', totalCost)
            // console.log("SPENDING DICT", spendingPerDayDict)
            // console.log("CAT DICT", categoryDict)

            let dayExpenseTable = document.getElementById("dayExpenseTable")
            let index2 = 1
            for (var day in spendingPerDayDict) {
                // console.log(dayExpenseTable.rows.length)
                var dayExpense = spendingPerDayDict[day]

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

            waterTank.style.width = waterTankNum + "%"
            waterTank.innerHTML = Math.ceil(waterTankNum) + "%"
            // this.updatePieChart(categoryDict)
        }  
        // this.updatePieChart(this.categoryDict)
        fetchAndUpdateData(this.tripCode)
    } 
    } 
</script> 
    
    <style scoped>
    
        .page {
            background-color: floralwhite;
        }
           table {
              width: 1300px;
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
                  text-align: left; 
              }
  
          th {
              text-align: center;
              color:white;
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
            background: #bada55;
            display: block;
            border-radius: 100px;
            position: relative;
            margin-left: 20px;
            left:30px;
        
        }

        .labelbtn h1 {
            position: absolute;
            top: 40%;
            left: 27.5%;
            transform: translate(-50%, -50%);
            z-index: 1;
            font-size:23px;
            color: white;
        }

        .labelbtn:after {
            content: '';
            position: absolute;
            top: 5px;
            left: 105px;
            width: 90px;
            height: 70px;
            background: #fff;
            border-radius: 90px;
            transition: 0.3s;
        }

        .inputbtn:checked + .labelbtn {
            background: grey;
        }

        .inputbtn:checked + .labelbtn:after {
            left: calc(100% - 5px);
            transform: translateX(-100%);
        }

        .labelbtn:active:after {
            width: 130px;
        }
    
    </style>
    