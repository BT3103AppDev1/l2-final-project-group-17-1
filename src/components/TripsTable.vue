<template>
   <section class="text-dark" id="topBar" style="background-color: floralwhite;">
      <div class="container">
          <div class="d-flex justify-content-between">
              <div class="text-center py-5" style= "width: 40rem;">
                  <div id="tripName" class="card-body px-5 d-flex flex-row">
                      <h1 style = "text-shadow: 2px 2px 7px grey">
                        Your Trips
                        <img src="planecropped.PNG" width="100px" style="object-position: right; margin-left: 20px; height: 100px;">
                      </h1> 

                  </div>
              </div>
          </div>
      </div>
  </section>
  
  <section class="container py-3" id="fullTableSection"> 
      <div class="d-flex justify-content-between px-3" style="text-align:justify;">

        <div class="d-flex flex-row">
          <div class = "dropdown px-3">
            <div class = "currencyButton" style="padding-left: 1140px;">
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

      <div class="scrollable">
        <table id="fullTable" class="table table-bordered  table-scroll text-center" cellspacing="0"
        width="100%" style="background-color: white;">
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
            <th class="th-sm">Trip Code
            </th>
            <th>Options</th>
            </tr>
        </thead>
        
        <!-- Data -->
        <!-- <tbody>
            <tr>
              <td><button type="button" class="btn btn-sm btn-dark" style="background-color: rgb(52, 146, 175);">Japan</button></td>
              <td>1 May 22 - 9 May 22</td>
              <td>Timothy, Chancy, Abby, ZhiQi</td>
              <td>JPY</td>
              <td>-50</td>
              <td>1000</td>
              <td>1200</td>
              <td>udhcbyvd#!</td>
              <td><button type="button" class="btn btn-sm btn-danger" style="border-radius: 50%;">Leave</button></td>
            </tr>
            <tr>
              <td><button type="button" class="btn btn-sm btn-dark" style="background-color: rgb(52, 146, 175);">Thailand</button></td>
              <td>20 May 22 - 29 May 22</td>
              <td>Timothy, Chancy, Abby, ZhiQi</td>
              <td>THB</td>
              <td>-50</td>
              <td>5000</td>
              <td>1000</td>
              <td>udhcbyvfsdsdd#!</td>
              <td><button type="button" class="btn btn-sm btn-danger" style="border-radius: 50%;">Leave</button></td>
            </tr>
        </tbody> -->
        </table>
        </div>
    </section>
  
</template>

<script>

    import db from '../firebase.js';
    import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
    import Navbar from '@/components/Navbar.vue';
    // const db = getFirestore(app);

    export default {
        name: 'Trips',
        components: {
            Navbar
        }, 
        mounted() {
          async function displayTrips(){
            let allTrips = await getDocs(collection(db, "Trip"))
            let index = 1
            
            allTrips.forEach((docs) => {
              let tripData = docs.data()
              let tripName = tripData.name
              let startDate = tripData.Start_Date

              let endDate = tripData.End_Date
              let people = tripData.userIds  //array
              let currency = tripData.Currency
              // let tripCode = 
                
              // let tripCode = tripData.Trip_Code


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

              cell2.innerHTML = startDate + " TO "+ endDate ;
              cell3.innerHTML = people;
              cell4.innerHTML = currency;
              cell5.innerHTML = 0;
              cell6.innerHTML = 0;
              cell7.innerHTML = 0;
              cell8.innerHTML = "abc"

              let tripButton = document.createElement("button")
              // tripButton.id  = String(tripName)
              tripButton.className= "bwt"
              tripButton.innerHTML = tripName

              cell1.appendChild(tripButton)


              let deleteTripButton = document.createElement("button")
              deleteTripButton.id = String(tripName) //need to change
              deleteTripButton.className = "bwt"
              deleteTripButton.innerHTML = "Leave"

              cell9.appendChild(deleteTripButton)
              deleteTripButton.onclick = function() {
                try {
                  deleteTrip(tripName)
                } catch(e) {
                  console.error(e.message)
                }
                
              }
              index +=1

            })
          }
          displayTrips()

          async function deleteTrip(tripName){
            alert("You are going to delete " + tripName)

          
              await deleteDoc(doc(db, "Trip", tripName))
              // await db.collection("Trip").doc(tripNme).delete()
            
            
            console.log("Trip successfully deleted!", tripName)
            let tb = document.getElementById("fullTable")
            while (tb.rows.length>1){
              tb.deleteRow(1)
            }
            displayTrips()
          }
        }
  }
</script>

<style scoped>
  body {
        background-color: floralwhite;
      }
      table {
                width: 1000px;
                border-collapse: collapse;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                border-top-right-radius: 20px;
                border-top-left-radius: 20px;
                border-bottom-right-radius: 20px;
                border-bottom-left-radius: 20px;
            }
    
            th,
            td {
                padding: 15px;
                background-color: rgba(255,255,255,0.2);
                color: black;
                font-family: Arial, Helvetica, sans-serif;
            }
    
            thead th {
                background-color: #55608f;
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
    
            th {
                text-align: center;
                color:white;
            }
</style>

  


