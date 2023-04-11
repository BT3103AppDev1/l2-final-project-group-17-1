<template>
  <div id ="app">
    <Navbar  />
    <router-view/>
  </div>
</template>

<script>
  import { RouterLink, RouterView } from 'vue-router' //need this line???
  import Navbar from '@/components/Navbar.vue'
  // import Trips from '@/views/Trips.vue'
  //import InputPage from '@/views/InputPage.vue'

  export default {
    name: 'App',
    components: {
        Navbar
    },
    data() {
      return {
      }
    },
  }
</script>

<style>

</style>
