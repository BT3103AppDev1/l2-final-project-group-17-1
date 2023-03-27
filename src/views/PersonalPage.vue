<template>
    <div class = "page">
        <!-- <BudgetBar :tripCode = 'tripCode'/> -->
        <!-- <PersonalExp :tripCode = 'tripCode'/>  -->
        <p>tripCode is : {{tripCode}}  {{tripExpenses}}</p>
        
      <!-- <div class = "container">
        <div id = "budget"> <Budget/> </div>
        <div id = "expenses"><PersonalExpenses/> </div>
      </div> -->
    
        <!-- Trip Name, Dropdown buttons, water tank, radio to switch indiv and group pages -->
    <section class="p-4 text-dark" id="topBar" style="background-color: floralwhite;">
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
                    <!-- Switch between indiv and group -->
                    <div class="d-flex flex-column px-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                            <label class="form-check-label" for="flexRadioDefault1">
                            Group
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                            <label class="form-check-label" for="flexRadioDefault2">
                            Individual
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Water tank -->
            <div class="container text-center card py-3" style="border-color: #55608f;">
                <h1>Status of Budget</h1>
                <div class="w3-light-grey w3-xlarge">
                    <div class="w3-container w3-green w3-center" style="width:50%;">50%</div>
                </div>
                <span>Your Budget: {{budget}}</span>
            </div>
        </div>
    </section>
        <!-- Table with all personal expenses -->
    <section class="py-5">
    <section class="container p-3" id="fullTableSection"> 
        
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
                <th class="th-sm" style="color:#111;">Type
                </th>
                <th class="th-sm" style="color:#111;">Option
                </th>
                </tr>
            </thead>

            </table>
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
    import {ref, onBeforeMount} from 'vue' 
    import PersonalExp from '@/components/PersonalExp.vue'
    import BudgetBar from '@/components/BudgetBar.vue';
    import { collection, doc, getDocs, query, where} from "firebase/firestore";


    //const trip = ref(null)
    //const route = useRoute()
    //const {tripCode} = $route.params.tripCode

    //onBeforeMount(() => {
    //    trip.value = getDoc(doc(db,"Trip", tripCode))
    //})

    //tripCode = $route.params.tripCode
    
    export default {
    name: "PersonalPage",
    props:{
        tripCode: String,
        budget: String,
        tripName: String,
        startDate: String,
        endDate: String,
        tripExpenses: Array
    },
    components:{
        Navbar,
        BudgetBar,
        PersonalExp
    },
    
    mounted() {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
        if (user) {
            this.user = user
            this.userid = user.uid
            this.name = user.Name
        }
        })
        
        async function fetchAndUpdateData(tripExpenses){
            let index = 1
            const auth=getAuth()
            const uid = auth.currentUser.uid
            tripExpenses = JSON.parse(tripExpenses)
            // const expenseArray = []
            let allExpenses = await getDocs(collection(db, "Expense"))
            allExpenses.forEach((expense) => {
            let users = expense.data().Users;
            console.log(String(expense.id))

            if (users.includes(String(uid)) && tripExpenses.includes(expense.id)) {

                // const name = expense.data().Name
                console.log(expense.data().Description)
                // expenseArray.push(expense.data())

                let expenseTable = document.getElementById("fullTable")
                let row = expenseTable.insertRow(index)
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
                let cell5 = row.insertCell(4);
                let cell6 = row.insertCell(5);

                cell1.innerHTML = expense.data().Date
                cell2.innerHTML = expense.data().Description
                cell3.innerHTML = expense.data().Category
                cell4.innerHTML = expense.data().Amount
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
            
            
        }
        fetchAndUpdateData(this.tripExpenses)

    }
    }
</script> 
    
    <style scoped>
    
        .page {
            background-color: floralwhite;
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
              background-color: rgba(255,255,255,0.2);
              color: black
          }
  
          thead th {
              background-color: #55608f;
  
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
    
    </style>
    