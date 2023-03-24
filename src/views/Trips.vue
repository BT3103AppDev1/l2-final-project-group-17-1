<template>
  <TripsTable/>
  <CreateTrip/>
</template>

<script>
import TripsTable  from '@/components/TripsTable.vue'
import CreateTrip from '@/components/CreateTrip.vue'
import Navbar from '@/components/Navbar.vue'
import firebaseApp from '@/firebase.js'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default {
  name: "App",
  components:{
    Navbar,
    TripsTable,
    CreateTrip
  },
  mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user
      }
    })
  }
}
</script> 

<style scoped>

</style>
