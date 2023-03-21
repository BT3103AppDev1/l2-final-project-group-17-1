<template>
  <TripsTable/>
  <CreateTrip/>
</template>

<script>
import TripsTable  from '@/components/TripsTable.vue'
import CreateTrip from '@/components/CreateTrip.vue'

export default {
  name: "App",
  components:{
    TripsTable,
    CreateTrip
  }
}
</script> 

<style scoped>

</style>
