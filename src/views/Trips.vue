<template style="">
<div class = "page">
  <TripsTable ref="table"/>
  <div style="display: flex; flex-direction: row; justify-content: center; margin-top: 150px;">
    <div id = "create" style="width:30%; margin-right: 5%;"><CreateTrip v-on:update="refresh"/> </div>
    <div id = "join" style="width:30%; margin-left: 5%;"><JoinTrip v-on:update="refresh"/> </div>
  </div>
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

    /* #create {
        flex: 1;

    }

    #join {

    }  */
    .page {
        background-color: floralwhite;
        min-height: 100vh;
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
*/
</style>
