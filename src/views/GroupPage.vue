<template>
    <h1>GROUP PAGE </h1>
    <div class="container">
            <div class="d-flex justify-content-between">
                <div class="text-center py-5" style= "width: 40rem;">
                    <div id="tripName" class="card-body px-5" style="text-align:justify; padding:5px">
                      <!-- <img src="globe.png" style="float:left;" width="120" height="auto">  -->
                      <h1>Trip to Japan</h1>
                      <span style="font-family:monospace;">1 Jan 2023 - 14 Jan 2023</span>
                    </div>
                </div>
            </div>
            </div>
</template>

<script>
    import db from '../firebase.js';
    import Navbar from '@/components/Navbar.vue'
    import {getAuth, onAuthStateChanged} from 'firebase/auth'


export default {
    name: "GroupPage",
    components:{
        Navbar,
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
        console.log("logged in", this.tripCode)

    }
        

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