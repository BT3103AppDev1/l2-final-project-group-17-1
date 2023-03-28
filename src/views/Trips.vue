<template>
<div class = "page">
  <TripsTable />
  <div class = "container">
    <div id = "create"> <CreateTrip/> </div>
    <div id = "join"><JoinTrip/> </div>
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
    }
  },
  components:{
    Navbar,
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
  }
}
</script> 

<style scoped>

    .page {
        background-color: floralwhite;
    }
    .container {
        display: flex;
        flex-direction: row;
        background-color: floralwhite;
        /* margin: 0; */
        padding: 0;
        right: 0;
        text-align: justify;
        justify-content: space-around;
        left: 100px;
    }

    #create {
        flex: 2;
        width: 100%;
    }

    #join {
        flex: 2;
        padding-top: 50px;
        right: 0;
        width: 100%;
    }
</style>
