<template>
    <div class = "trippage">
        <TripsTable ref="table"/>
       
        <div class = "container">
            <div id = "create"> <CreateTrip v-on:update="refresh"/> </div>
        </div>
        <div id = "join"><JoinTrip v-on:update="refresh"/> </div>
    </div>
</template>

<script>
import TripsTable  from '@/components/TripsTable.vue'
import CreateTrip from '@/components/CreateTrip.vue'
import Navbar from '@/components/Navbar.vue'
import JoinTrip from '@/components/JoinTrip.vue'
import firebaseApp from '@/firebase.js'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default {
  name: "Trip",

  data() {
    return {
        shared:[]
    }
  },
  components:{
    // Navbar,
    TripsTable,
    CreateTrip,
    JoinTrip
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
    
  },
  methods: {
    refresh() {
        const tripsTable = this.$refs.table;
        tripsTable.refresh();
        // tripsTable.displayTrips();
    }
  }
}
</script> 

<style scoped>
    .container{
        display: flex;
        flex-direction: row;
    }

    #create {
        flex: 1;

    }

    #join {
        flex: 2;
        padding-top: 50px; 
        right: 0;
        width: 100%;
    } 
    .trippage {
        background-color: floralwhite;
        
    }
        /* position: auto; */
    /* }
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        display: flex;
        flex-direction: row;
        background-color: floralwhite;
        margin: 0;
        padding: 0;
        right: 0;
        text-align: justify;
        justify-content: space-between;
        left: 100px;
    }

    #create {
        flex: 1;
        width: 50px
    }

    #join {
        flex: 1;
        padding-top: 50px; */
        /* right: 0;
        width: 100%;
    }  */
</style>
