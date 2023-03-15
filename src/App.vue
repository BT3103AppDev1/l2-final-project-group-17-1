<template>
  <div id ="nav">
   <router-link to = "/InputPage"> InputPage </router-link> |
   <!-- <router-link to = "profit"> Profits </router-link> -->
  </div>
  <router-view/>
</template>

<script>
  import { RouterLink, RouterView } from 'vue-router' //need this line???
  export default{
   name: 'App'
  }
</script>

<style>

</style>
